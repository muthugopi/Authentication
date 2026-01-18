import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    console.log("middleware runs !!");
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        console.log(`authentication for ${decoded.user} has OK !!`);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
