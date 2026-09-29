import prisma from "../lib/neon.js";
import crypto from "node:crypto";
import redis from "../lib/redis.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD, // Google App Password
  },
});

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export async function Send_otp(req, res) {
  let key;

  try {
    const email = req.body.data
    
    if (!email) {
        console.log("coming")
      return res.status(400).json({
        message: "Enter email first",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
            console.log("coming2")

      return res.status(404).json({
        message: "User is not in database",
      });
    }

    let otp = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = crypto.randomInt(0, CHARACTERS.length);
      otp += CHARACTERS[randomIndex];
    }
    

    key = `otp:verify:${email}`;

    await redis.set(key, otp, {
      ex: 5 * 60,
    });

   const info= await transporter.sendMail({
      from: `"Ravi.Inc" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "Your verification code",
      text: `Your verification code is ${otp}. It expires in 5 minutes.`,
    });

    console.log("Message ID:", info.messageId);
console.log("Accepted:", info.accepted);
console.log("Rejected:", info.rejected);
console.log("Response:", info.response);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    if (key) {
      await redis.del(key).catch(() => {});
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}