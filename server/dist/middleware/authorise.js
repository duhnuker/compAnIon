import jwt from "jsonwebtoken";
import 'dotenv/config';
export default (req, res, next) => {
    const token = req.header("jwt_token");
    if (!token) {
        return res.status(403).json("Not Authorised");
    }
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verify.user;
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ msg: "Invalid token" });
        }
        else if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ msg: "Token expired" });
        }
        else {
            console.error(error.message);
            return res.status(500).json({ msg: "Server error during authentication" });
        }
    }
};
