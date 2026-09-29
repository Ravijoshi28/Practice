import redis from "../lib/redis.js";
import prisma from "../lib/neon.js";

export async function Verify_OTP(req, res) {
  try {

    console.log("received")
    const { otp } = req.body;
    const { email } = req.query;

    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      !email.trim() ||
      !otp.trim() ||
      otp.trim().length !== 6
    ) {
      return res.status(400).json({
        message: "Email or OTP is invalid",
      });
    }
    

    const normalizedEmail = email.trim();
    const enteredOtp = otp.trim();

    const key = `otp:verify:${normalizedEmail}`;
    const cachedOtp = await redis.get(key);

    if (!cachedOtp) {
      return res.status(400).json({
        message: "OTP is invalid or expired",
      });
    }

    if (String(cachedOtp) !== enteredOtp) {
      return res.status(400).json({
        message: "OTP is incorrect",
      });
    }

    await prisma.user.update({
      where: {
        email: normalizedEmail,
      },
      data: {
        isVerified: true,
      },
    });

    // Prevent OTP reuse
    await redis.del(key);

    return res.status(200).json({
      message: "User verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}