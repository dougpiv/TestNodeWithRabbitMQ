import { Request, Response } from "express";
import path from "path";
import { prismaClient } from "../database/prismaClient";
import RabbitmqServer from "../rabbitmq-server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class FirstController {
    public home(req: Request, res: Response) {
        return res.sendFile(path.join(__dirname, "../public/html/test.html"));
    }

    async newUser(req: Request, res: Response) {
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    email: req.body.email,
                },
            });
            if (user) {
                return res.status(401).json({ message: "Fail to create" });
            } else {
                var salt = bcrypt.genSaltSync(10);
                var password = bcrypt.hashSync(req.body.password, salt);
                const createuser = await prismaClient.user.create({ data: { email: req.body.email, password: password } });
                return res.status(200).json({ message: "User created", id: createuser.id });
            }
        } catch (error) {
            return res.status(401).json({ message: "Fail to create" });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    email: req.body.email,
                },
            });
            console.log(user);
            if (user) {
                const validatePassword = await bcrypt.compare(req.body.password, user.password);
                console.log(validatePassword);
                if (validatePassword) {
                    let token = jwt.sign(
                        {
                            id_user: user.id,
                            email: req.body.email,
                        },
                        process.env.JWT_KEY as string,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({ message: "success" , "token" : token});
                } else {
                    return res.status(401).json({ message: "Fail to authenticate" });
                }
            } else {
                return res.status(401).json({ message: "Fail to authenticate" });
            }
        } catch (error) {
            return res.status(401).json({ message: "Fail to authenticate" });
        }
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

            const server = new RabbitmqServer("amqp://admin:admin@localhost:5672");
            await server.start();
            await server.publishInQueue(
                "s2",
                JSON.stringify({
                    data: req.body,
                    product: product,
                }),
                {
                    correlationId: correlation,
                }
            );

            // ConsumeSync tem que ficar esperando a msg
            await server.consumeSync("s1", (message) => console.log(JSON.parse(message.content.toString())), {
                correlationId: correlation,
            });

            return res.status(200).json(product);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error", error });
        }
    }
}

export const firstController = new FirstController();
