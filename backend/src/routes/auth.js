import Router from "express"
import { Signup } from "../controller/signup.js";
import { Verify_OTP } from "../controller/otp.js";
import { Send_otp } from "../controller/Send_otp.js";
import { Login } from "../controller/login.js";
import { verify } from "../middleware/verify.js";
import { Logout } from "../controller/logout.js";

const router= Router();

router.post("/signup",Signup);
router.post("/verify",Verify_OTP);
router.post("/otp",Send_otp)
router.post("/login",Login)
router.get("/session", verify, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ user: req.user.user });
});
router.post("/logout", verify, Logout);

export default router
