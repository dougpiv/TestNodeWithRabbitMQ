import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient"

class FirstController {

    public home(req: Request, res: Response) {
        return res.json({
            message: "Hello world",
        });
    }

    async newProduct(req: Request, res: Response) {
        
    }

}

export const firstController = new FirstController();
