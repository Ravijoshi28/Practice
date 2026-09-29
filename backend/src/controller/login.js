import prisma from "../lib/neon.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  GenerateToken,
  GenerateRefreshToken,
} from "../token/generateToken.js"
import { AuthLimiter } from "../lib/rate_Limiter.js";

dotenv.config();

const pepper = process.env.PEPPER;

export async function Login(req, res) {
  try {
    const { email, password } = req.body;
    const normalizeEmail=email.trim().toLowerCase()

    const forwardedFor=req.headers["x-forwarded-for"]
    const clientIp=typeof forwardedFor==="string"?forwardedFor.split(",")[0].trim():req.socket.remoteAddress;
    console.log(clientIp)

    const emailLimit=await AuthLimiter.limit(
      `login:email:${normalizeEmail}`
    )

    const ipLimit=await AuthLimiter.limit(
      `loin:ip:${clientIp}`
    )

    if(!emailLimit.success || !ipLimit.success){
      return res.status(429).json({message:"Too many request"})
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Only one database query
    const user = await prisma.user.findUnique({
      where: {
        email: normalizeEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email or password is wrong",
      });
    }

    const pepperedPassword = password + pepper;

    // Plain peppered password first, stored hash second
    const matched = await bcrypt.compare(
      pepperedPassword,
      user.password
    );

    if (!matched) {
      return res.status(401).json({
        message: "Email or password is wrong",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    // Keep the JWT payload small
    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = GenerateToken(tokenPayload);
    const refreshToken = GenerateRefreshToken(tokenPayload);

    await prisma.user.update({
      where:{
        id: user.id
      },
      data:{
        refresh:refreshToken
      }
    })

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 20 * 60 * 1000, // 20 minutes
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/refresh",
    });

    // Never send the password hash to the frontend
    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      message: "User logged in",
      data: userDetails,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}
