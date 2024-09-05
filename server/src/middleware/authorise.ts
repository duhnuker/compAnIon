import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

interface JwtPayload {
    user: {
        id: string;
    };
}

export default (req: Request & { user?: { id: string } }, res: Response, next: NextFunction) => {
    console.log("Authorise middleware called");

    const token = req.header("jwt_token");
    console.log("Received token:", token);

    if (!token) {
        console.log("No token provided");
        return res.status(403).json("Not Authorised");
    }

    try {
        console.log("Attempting to verify token");
        const verify = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = verify.user;
        console.log("Token verified, user:", req.user);
        next();

    } catch (error) {
        console.log("Error verifying token:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ msg: "Invalid token" });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ msg: "Token expired" });
        } else {
            console.error((error as Error).message);
            return res.status(500).json({ msg: "Server error during authentication" });
        }
    }
};