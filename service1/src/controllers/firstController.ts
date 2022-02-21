import { Request, Response } from "express";
import path from "path";
import { prismaClient } from "../database/prismaClient";
import RabbitmqServer from "../rabbitmq-server";

class FirstController {
    public home(req: Request, res: Response) {
        return res.sendFile(path.join(__dirname,'../public/html/test.html'));
    }

    async newProduct(req: Request, res: Response) {
        const { name, bar_code, price } = req.body;
        try {
            const product = await prismaClient.product.create({
                data: {
                    name,
                    bar_code,
                    price,
                },
            });

            const correlation = product.id.toString();

            const server = new RabbitmqServer(
                "amqp://admin:admin@localhost:5672"
            );
            await server.start();
            await server.publishInQueue(
                "s2",
                JSON.stringify({
                    data: req.body,
                    product: product,
                }),
                {
                    correlationId: correlation
                }
            );
            
            // ConsumeSync tem que ficar esperando a msg
            await server.consumeSync( "s1" , (message) => console.log(JSON.parse(message.content.toString())), {
                correlationId: correlation
            })
            
            return res.status(200).json(product);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error", error });
        }
    }
    
}

export const firstController = new FirstController();
