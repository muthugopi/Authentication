import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs';

export const makeMeAdmin = async (req, res) => {
    try {
        const { secret } = req.body;
        console.log("make me admin is running !!");
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const oldToken = authHeader.split(' ')[1];
        const decoded = jwt.verify(oldToken, process.env.SECRET);

        if (secret !== process.env.SECRET) {
            return res.status(403).json({ message: "Access Denied" });
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
                role: 'admin',
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

        console.log(`${user.name} successfully promoted to admin !!`);

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

export const makeUserModerator = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Only admin can promote users" });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "moderator") {
      return res.status(200).json({
        message: "User is already a moderator",
        role: "moderator",
      });
    }

    user.role = "moderator";
    await user.save();

    console.log(`${user.name} promoted to moderator by admin`);

    return res.status(200).json({
      message: "User promoted to moderator",
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
