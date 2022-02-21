import { Connection, Channel, connect, Message, ConsumeMessage, Options } from "amqplib";

export default class RabbitmqServer {
    private conn: Connection | undefined;
    private channel: Channel | undefined;
    private uri: string;

    constructor(url: string) {
        this.uri = url;
    }

    async start(): Promise<void> {
        this.conn = await connect(this.uri);
        this.channel = await this.conn.createChannel();
    }

    async publishInQueue(queue: string, message: string, options?: Options.Publish) {
        if (typeof options !== "undefined") {
            return this.channel?.sendToQueue(queue, Buffer.from(message), options);
        }
        return this.channel?.sendToQueue(queue, Buffer.from(message));
    }

    async consume(queue: string, callback: (message: Message) => void) {
        return this.channel?.consume(queue, (message) => {
            if (message != null) {
                callback(message);
                this.channel?.ack(message);
                
            }
        });
    }
    async consumeSync(queue: string, callback: (message: Message) => void, options: Options.Publish) {
        return this.channel?.consume(
            queue,
            (message) => {
                if (message != null) {
                    if (message.properties.correlationId === options.correlationId) {
                        callback(message);
                        this.channel?.ack(message);
                        this.channel?.close();
                    }
                }
            },
            options
        );
    }
}
