import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs';

export const makeMeAdmin = async (req, res) => {
    try {
        const { secret } = req.body;
        const Header = req.headers.authorization;
        if (!Header) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = Header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded
        if (secret === process.env.SECRET) {
            const user = await User.findOne({
                where : {email : req.user.email}
            });
            user.role = 'admin';
            await user.save();
            const token = jwt.sign(
                { id: user._id, name: user.name, role: user.role },
                process.env.SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({
                user: {
                    name: req.user.name,
                    role: req.user.role
                },
                token,
                message: "Your promoted to admin !!"
            });
        }
        return res.status(403).json({ message: "Forbidden !!" });
    } catch (err) {
        console.log(err)
        return res.status(500).json("Internal server error")
    }
}