import express from 'express';
import cors from 'cors';
import {first} from './routes/firstRoute';
import RabbitmqServer from './rabbitmq-server';
import { rabbitmqFuncs } from './rabbitmqfunc';


export class App {
    public server: express.Application;


    constructor() {
        this.server = express();
        this.middleware();
        this.routes();
        this.rabbitmqStart();
    }

    private middleware() {
        this.server.use(express.json());
        this.server.use(cors());
    }

    public routes(){
        this.server.use(first);
    }

    async rabbitmqStart(){
        const server = new RabbitmqServer(
            "amqp://admin:admin@localhost:5672"
        );
        await server.start();
        await server.consume('s2', message => rabbitmqFuncs.createProduct(message.content.toString(), message));
    }
}