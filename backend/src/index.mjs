import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';

import passport from './utils/passport.mjs';  
import sequelize from './config/db.mjs';
import authRouter from './routes/auth.routes.mjs';
import publicRouter from './routes/public.routes.mjs';
import message from './routes/message.routes.mjs';
import userRouter from './routes/user.routes.mjs';
import contactRouter from './routes/contact.routes.mjs'

const app = express();

app.use(express.json());

//middlewares
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 *24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api', publicRouter);
app.use('/api/message', message);
app.use('/api', userRouter);
app.use('/api/portfolio/message', contactRouter);
app.use((req, res) => res.status(404).json({ message: "Not Found", description: "The Route Is Not Found On The Server" }));


(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected Successfully !");

    await sequelize.sync();
    console.log("Table Connected Successfully"); 

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => console.log(`Server Running On Port : ${PORT}`));
  }
  catch (err) {
    console.log("Error While Connecting Database : " + err);
  }
})();
