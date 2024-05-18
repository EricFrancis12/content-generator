import amqplib from 'amqplib';
import _shared, { ISavedContent, TFilterQueueItem, TPublishQueueItem, IFIlterComponent, EFilterComponentType } from '../../_shared';
const { initRabbitMQ, RABBITMQ_EXCHANGE } = _shared.amqp;
const { getSavedContentViaInternalId } = _shared.utils;
import operations from '../operations';
import { logger, formatErr } from '../config/loggers';
import config from '../config/config';
const { RABBITMQ_IP, RABBITMQ_PORT, RABBITMQ_FILTER_QUEUE, RABBITMQ_PUBLISH_QUEUE } = config;

export default class ApplyFiltersEngine {
    channel: amqplib.Channel | null;
    consumer: amqplib.Replies.Consume | undefined;

    constructor({ channel, startWhenConnected }: {
        channel?: amqplib.Channel,
        startWhenConnected?: boolean
    } = {}) {
        if (channel) {
            this.channel = channel;
        } else {
            this.channel = null;
            const ampqUrl = `amqp://${RABBITMQ_IP}:${RABBITMQ_PORT}`;
            const connectWithRetry = initRabbitMQ(ampqUrl);
            connectWithRetry().then((_channel) => {
                if (_channel) {
                    this.channel = _channel;
                    this.channel.prefetch(1);
                    if (startWhenConnected) {
                        this.start();
                    }
                }
            });
        }
    }

    async start() {
        if (this.channel) {
            return this.channel.consume(RABBITMQ_FILTER_QUEUE, async (msg) => {
                if (msg != null) {
                    const filterQueueItem = JSON.parse(msg.content.toString()) as TFilterQueueItem;
                    logger.info('Received new message: ');
                    logger.info(JSON.stringify(filterQueueItem));
                    const { sourceType, filters, contentPath } = filterQueueItem;

                    const results: ISavedContent[] = [];
                    let errored = false;
                    for (let i = 0; i < filters.length; i++) {
                        const { name, base, ingredient, options } = filters[i];
                        const operation = operations[name];
                        if (!operation) {
                            logger.error('Operation not found');
                            break;
                        }

                        const baseContentPathProm = getContentPath(base, results, contentPath);
                        const ingredientContentPathProm = getContentPath(ingredient, results, contentPath);

                        const baseContentPath = await baseContentPathProm;
                        const ingredientContentPath = await ingredientContentPathProm;
                        if (!baseContentPath || !ingredientContentPath) {
                            logger.error('Missing Base and/or Ingredient content path');
                            break;
                        }

                        try {
                            const baseContent: ISavedContent = {
                                sourceType,
                                contentType: base.contentType,
                                path: baseContentPath
                            };
                            const ingredientContent: ISavedContent = {
                                sourceType,
                                contentType: ingredient.contentType,
                                path: ingredientContentPath
                            };

                            const isLastFilter = filters.length - 1 === i;
                            const result = await operation(baseContent, ingredientContent, isLastFilter, options);
                            results.push(result);
                        } catch (err) {
                            logger.error(formatErr(err));
                            errored = true;
                            break;
                        }
                    }

                    if (!errored && !!results[results.length - 1]) {
                        const publishQueueItem: TPublishQueueItem = {
                            ...filterQueueItem,
                            contentPath: results[results.length - 1].path
                        };
                        this.channel?.publish(RABBITMQ_EXCHANGE, RABBITMQ_PUBLISH_QUEUE, Buffer.from(JSON.stringify(publishQueueItem)));
                    } else {
                        // ... handle situation if all filters were not able to be applied
                    }

                    this.channel?.ack(msg);
                }
            });
        }
    }

    async stop(consumerTag: string) {
        if (this.channel) {
            return this.channel.cancel(consumerTag);
        }
    }
}

async function getContentPath(component: IFIlterComponent, results: ISavedContent[], contentPath: string): Promise<string | undefined> {
    if (component.type === EFilterComponentType.SOURCE) {
        return contentPath;
    } else if (component.type === EFilterComponentType.SAVED) {
        return (await getSavedContentViaInternalId(component.internalId))?.path;
    } else if (component.type === EFilterComponentType.TEMP) {
        return results[component.filterIndex]?.path;
    }
    return undefined;
}
