import amqplib from 'amqplib';
import _shared, { EContentType, EOutputType, TPublishQueueItem } from '../../_shared';
const { initRabbitMQ } = _shared.amqp;
const { copyFileToNewLocation } = _shared.utils;
import { logger, formatErr } from '../config/loggers';
import config from '../config/config'
import { addToOutputHistory, sendImageToTelegramChannel, sendMessageToTelegramChannel, sendVideoToTelegramChannel } from '../data';
const { RABBITMQ_IP, RABBITMQ_PORT, RABBITMQ_PUBLISH_QUEUE } = config;

export default class PublishEngine {
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
            return this.channel.consume(RABBITMQ_PUBLISH_QUEUE, async (msg) => {
                if (msg != null) {
                    try {
                        const publishQueueItem = JSON.parse(msg.content.toString()) as TPublishQueueItem;
                        logger.info('Received new message: ');
                        logger.info(JSON.stringify(publishQueueItem));
                        const { campaign_id, sourceType, publishTo, contentPath } = publishQueueItem;

                        for (let i = 0; i < publishTo.length; i++) {
                            const output = publishTo[i];
                            const { outputType, contentType, externalId, options, disabled } = output;

                            if (disabled) {
                                continue;
                            }

                            let success = false;
                            if (outputType === EOutputType.KEEP_SAVED) {
                                const fileName = contentPath.split('/').at(-1);
                                const contentTypeFolder = contentPath.split('/').at(-2);
                                if (!!fileName && !!contentTypeFolder) {
                                    const newFilePath = `./shared-file-system/keep-saved-content/${contentTypeFolder}/${fileName}`;
                                    success = await copyFileToNewLocation(contentPath, newFilePath);
                                }
                            } else if (outputType === EOutputType.SEND_MESSAGE_TO_TELEGRAM_CHANNEL && options?.message) {
                                success = await sendMessageToTelegramChannel(externalId, options.message);
                            } else if (outputType === EOutputType.SEND_CONTENT_TO_TELEGRAM_CHANNEL) {
                                if (contentType === EContentType.IMAGE) {
                                    success = await sendImageToTelegramChannel(externalId, contentPath);
                                } else if (contentType === EContentType.VIDEO) {
                                    success = await sendVideoToTelegramChannel(externalId, contentPath);
                                } else {
                                    logger.error(`Unknown output content type: ${contentType}`);
                                }
                            } else {
                                logger.error(`Unknown output type: ${outputType}`);
                            }

                            if (success) {
                                await addToOutputHistory({
                                    sourceType,
                                    contentType,
                                    campaign_id,
                                    externalId,
                                    outputType,
                                    timestamp: Date.now()
                                });
                            }
                        }
                    } catch (err) {
                        logger.error(formatErr(err));
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
