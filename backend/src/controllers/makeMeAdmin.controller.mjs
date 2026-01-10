import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs';

export const makeMeAdmin = async (req, res) => {
    try {
        const { secret } = req.body;

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const oldToken = authHeader.split(' ')[1];
        const decoded = jwt.verify(oldToken, process.env.SECRET);

        // Validate admin secret
        if (secret !== process.env.SECRET) {
            return res.status(403).json({ message: "Forbidden !!" });
        }

        const user = await User.findOne({
            where: { email: decoded.email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'admin') {
            return res.status(200).json({
                message: "You already have admin role",
                token: oldToken
            });
        }

        user.role = 'admin';
        await user.save();

        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role, email: user.email },
            process.env.SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            user: {
                name: user.name,
                role: user.role
            },
            token,
            message: "You are promoted to admin"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
