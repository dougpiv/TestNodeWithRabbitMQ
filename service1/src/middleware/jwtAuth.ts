import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class JwtAuth{
public  requiredAuth(req: Request,res: Response,next: NextFunction){
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decode = jwt.verify(token as string, process.env.JWT_KEY as string);
        req.body.jwtuser = decode;
        next();
    } catch (error) {
        return res.status(401).json({mensagem: "Fail to authenticate token"})        
    }

}

}
export const jwtAuth = new JwtAuth();