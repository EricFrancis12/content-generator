import amqplib from 'amqplib';
import { downloadRedditImage, downloadYouTubeVideo } from '../data';
import _shared, { EContentType, ESourceType, TDownloadQueueItem, TFilterQueueItem, TPublishQueueItem } from '../../_shared';
const { initRabbitMQ, RABBITMQ_EXCHANGE } = _shared.amqp;
const { generateInternalId } = _shared.utils;
import config from '../config/config';
const { RABBITMQ_IP, RABBITMQ_PORT, RABBITMQ_DOWNLOAD_QUEUE, RABBITMQ_FILTER_QUEUE, RABBITMQ_PUBLISH_QUEUE } = config;

export default class DownloadEngine {
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
            return this.channel.consume(RABBITMQ_DOWNLOAD_QUEUE, async (msg) => {
                if (msg != null) {
                    try {
                        const downloadQueueItem = JSON.parse(msg.content.toString()) as TDownloadQueueItem;
                        console.log('Received new message: ');
                        console.log(downloadQueueItem);
                        const { sourceType, contentType, externalId, filters } = downloadQueueItem;
                        const internalId = generateInternalId();
                        if (sourceType === ESourceType.YOUTUBE) {
                            if (contentType === EContentType.VIDEO) {
                                if (filters.length > 0) {
                                    const outputPath = `./shared-file-system/source-content/YouTube/videos/${internalId}.mp4`;
                                    const video = await downloadYouTubeVideo(externalId, outputPath);
                                    const filterQueueItem: TFilterQueueItem = {
                                        ...downloadQueueItem,
                                        contentPath: video.path
                                    };
                                    this.channel?.publish(RABBITMQ_EXCHANGE, RABBITMQ_FILTER_QUEUE, Buffer.from(JSON.stringify(filterQueueItem)));
                                } else {
                                    const outputPath = `./shared-file-system/output-content/videos/${internalId}.mp4`;
                                    const video = await downloadYouTubeVideo(externalId, outputPath);
                                    const publishQueueItem: TPublishQueueItem = {
                                        ...downloadQueueItem,
                                        contentPath: video.path,
                                        internalId
                                    }
                                    this.channel?.publish(RABBITMQ_EXCHANGE, RABBITMQ_PUBLISH_QUEUE, Buffer.from(JSON.stringify(publishQueueItem)));
                                }
                            } else {
                                console.error('YouTube content types other than VIDEO not yet implimented');
                            }
                        } else if (sourceType === ESourceType.REDDIT) {
                            if (contentType === EContentType.IMAGE) {
                                if (filters.length > 0) {
                                    const outputPath = `./shared-file-system/source-content/Reddit/images/${internalId}.jpg`;
                                    const image = await downloadRedditImage(externalId, outputPath);
                                    const filterQueueItem: TFilterQueueItem = {
                                        ...downloadQueueItem,
                                        contentPath: image.path
                                    };
                                    this.channel?.publish(RABBITMQ_EXCHANGE, RABBITMQ_FILTER_QUEUE, Buffer.from(JSON.stringify(filterQueueItem)));
                                } else {
                                    const outputPath = `./shared-file-system/source-content/Reddit/images/${internalId}.jpg`;
                                    const image = await downloadRedditImage(externalId, outputPath);
                                    const publishQueueItem: TPublishQueueItem = {
                                        ...downloadQueueItem,
                                        contentPath: image.path,
                                        internalId
                                    }
                                    this.channel?.publish(RABBITMQ_EXCHANGE, RABBITMQ_PUBLISH_QUEUE, Buffer.from(JSON.stringify(publishQueueItem)));
                                };
                            } else {
                                console.error('Reddit content types other than IMAGE not yet implimented');
                            }
                        } else {
                            console.error('Source types other than YOUTUBE not yet implimented');
                        }
                    } catch (err) {
                        console.error(err);
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
