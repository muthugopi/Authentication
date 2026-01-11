import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.model.mjs";
import { compare } from "./hash.mjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          where: { email: email.toLowerCase() },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport