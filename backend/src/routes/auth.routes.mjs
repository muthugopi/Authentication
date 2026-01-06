import express from "express";
import { register, login, profile } from "../controllers/auth.controller.mjs";
import passport from "../utils/passport.mjs";
import { authMiddleware } from "../middlewares/auth.middleware.mjs";

const router = express.Router();

// Public routes -> anyont can access it 
router.post("/register", register);
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: "Server error" });
        }
        if (!user) {
            return res.status(401).json({ error: info.message || "Invalid credentials" });
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: "Login failed" });
            }

            return res.status(200).json({
                message: "Login successful!",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
        });
    })(req, res, next);
});


// Protected route -> only logined user can access it !
router.get("/profile",authMiddleware, profile);

export default router;
