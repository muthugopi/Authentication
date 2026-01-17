import passport from '../utils/passport.mjs';
import User from '../models/user.model.mjs';
import {hash} from '../utils/hash.mjs';
import jwt from 'jsonwebtoken';
import ActivityLog from '../models/activityLog.model.mjs';

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

    const user = await User.create({ name, email, password: hashedPassword, role : 'user' });
    await ActivityLog.create({
      name : name,
      activity : "Created An Account"
    })
    user.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error(`Error inside the User Controllers:\n${err}`);
    res.status(500).json({ error: "Server error" });
  }
};



export const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
  return res.status(500).json({
    success: false,
    error: err.message
  });
}

    if (!user) return res.status(400).json({ message: info.message });
    req.logIn(user, (err) => { 
      if (err) return next(err);

      const token = jwt.sign(
        {id:req.user.id, name:req.user.name, email:req.user.email, role:req.user.role},
        process.env.SECRET,
        {expiresIn : '1d'}
      )
      console.log(`User ${user.name} has logined successfully !!`);
      ActivityLog.create({
        name : req.user.name,
        activity : "Logined"
      })
      res.json({
        message: "Login successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role:user.role || 'user'
        },
        token : token,
      });
      //console.log(user.role)
    });
  })(req, res, next);
};



export const checkAuth = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ loggedIn: false });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return res.json({
      loggedIn: true,
      user: decoded,
    });
  } catch (err) {
    console.log(err)  
    return res.status(401).json({ loggedIn: false });
  }
};