import jwt from 'jsonwebtoken';

export const authorize = (...roles) => {
    return (req, res, next) => {
        try {
            const authHeader = re1.authHeader.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: "Unauthorized" })
            }
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET);

            req.user = decoded;

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden: You do not have access' });
            }

            next();

        }
        catch (err) {
            return res.status(401).json({message : "Invalid Token"})
        }
    }
}