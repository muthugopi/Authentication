import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import passport from './utils/passport.mjs';
import sequelize from './config/db.mjs';
import authRouter from './routes/auth.routes.mjs'

const app = express();

app.use(express.json());

//middlewares
app.use(morgan('dev'));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
  secret: process.env.SECRET || "my_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "lax", 
    secure: false 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);

app.get("/test-session", (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    session: req.session,
    user: req.user || null
  });
});



(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected Successfully !");
    
    await sequelize.sync();
    console.log("Table Connected Successfully");
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server Running On Port : ${PORT}`));
  }
  catch(err) {
    console.log("Error While Connecting Database");
  }
})();
