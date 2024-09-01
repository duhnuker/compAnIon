import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
    user: {
        id: string;
    };
}

    const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const token = req.header("jwt_token");

    if (!token) {
        return res.status(403).json("Not Authorised");
    }

    try {

        const verify = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        (req as any).user = verify.user;

        next();

    } catch (error) {
        console.error((error as Error).message);
        return res.status(403).json({ msg: "Token is not valid" });
    }
};

export default authMiddleware;