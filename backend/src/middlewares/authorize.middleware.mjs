import jwt from 'jsonwebtoken';

export const authorize = (role) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                console.log("running !")
                return res.status(401).json({ message: "Unauthorized" })
            }
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET);

            req.user = decoded;
            if (role != decoded.role) {
                return res.status(403).json({ message: 'Forbidden: You do not have access' });
            }

            next();

        }
        catch (err) {
            console.log("catch runs : " + err);
            return res.status(401).json({message : err})
        }
    }
}