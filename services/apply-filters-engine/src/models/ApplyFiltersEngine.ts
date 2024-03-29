import amqplib from 'amqplib';
import _shared, {
    ISavedContent, ISavedVideo, TFilterQueueItem, TPublishQueueItem,
    EFilterComponentType, ESourceType, EContentType
} from '../../_shared';
const { initRabbitMQ } = _shared.amqp;
const { getSavedContentViaInternalId } = _shared.utils;
import operations from '../operations';
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
                    console.log('Received new message: ');
                    console.log(filterQueueItem);
                    const { sourceType, contentType, externalId, filters } = filterQueueItem;

                    const results: ISavedContent[] = [];
                    for (let i = 0; i < filters.length; i++) {
                        const { name, base, ingredient, options } = filters[i];
                        const baseComponentType = base.type;
                        const ingredientComponentType = ingredient.type;
                        const operation = operations[name];
                        if (!operation) {
                            console.error('Operation not found');
                            break;
                        }

                        const baseContentPath = await getSavedContentViaInternalId(base.internalId).then(content => content?.path);
                        if (!baseContentPath) {
                            console.log('Base content path not found');
                            break;
                        }

                        const ingredientContentPath = await getSavedContentViaInternalId(ingredient.internalId).then(content => content?.path);
                        if (!ingredientContentPath) {
                            console.log('Ingredient content path not found');
                            break;
                        }

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
                        try {
                            const result = await operation(baseContent, ingredientContent, options);
                            results.push(result);
                        } catch (err) {
                            console.error(err);
                            break;
                        }
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
