import { Message } from "amqplib";
import { prismaClient } from "./database/prismaClient";
import RabbitmqServer from "./rabbitmq-server";

class RabbitmqFuncs {
    async createProduct(data: string, message: Message) {
        const dataJson = JSON.parse(data);
        console.log(JSON.parse(data));
        try {
            const product = await prismaClient.product.create({
                data: {
                    idservico1: dataJson.product.id,
                    quantity: dataJson.data.quantity,
                },
            });
            const server = new RabbitmqServer("amqp://admin:admin@localhost:5672");
            await server.start();

            await server.publishInQueue(
                "s1",
                JSON.stringify({
                    id: product.id,
                }),
                {
                    correlationId: message.properties.correlationId,
                }
            );
            await server.publishInQueue(
                "s1",
                JSON.stringify({
                    id: product.id,
                })
            );
            console.log(product);
        } catch (error) {
            console.log(error);
        }
        //enviar para rabbit o retorno do ok
    }
}

export const rabbitmqFuncs = new RabbitmqFuncs();
