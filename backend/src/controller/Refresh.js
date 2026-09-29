import jwt from "jsonwebtoken";
import prisma from "../lib/neon.js";
import { GenerateToken } from "../token/generateToken.js";

export async function Refresh(req, res) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Login required",
    });
  }

  try {
    // Throws an error if invalid or expired
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH,
      {
        algorithms: ["HS256"],
      }
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.user,
      },
      select: {
        id: true,
        email: true,
        refresh: true,
      },
    });

    // Check whether this refresh token is still active
    if (!user || user.refresh !== refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token. Please log in again.",
      });
    }

    // Create a new clean payload
    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = GenerateToken(tokenPayload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 20 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: "Access token generated",
    });
  } catch (error) {
    if (!(error instanceof jwt.JsonWebTokenError)) {
      console.error("Session refresh failed:", error);
      return res.status(500).json({ message: "Unable to restore session. Please try again." });
    }
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/refresh", 
    });

    return res.status(401).json({
      message: "Refresh token expired. Please log in again.",
    });
  }
}
