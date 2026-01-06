import passport from '../utils/passport.mjs';
import User from '../models/user.model.mjs';
import {hash} from '../utils/hash.mjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields must be filled!" });
    }

    const existCheck = await User.findOne({ where: { email } });
    if (existCheck) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const hashedPassword = await hash(password);

    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error(`Error inside the User Controllers:\n${err}`);
    res.status(500).json({ error: "Server error" });
  }
};



export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);

      const token = jwt.sign(
        {id:req.user.id},
        process.env.SECRET,
        {expiresIn : '1d'}
      )
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token : token,
      });
    });
  })(req, res, next);
};

export const profile = (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};