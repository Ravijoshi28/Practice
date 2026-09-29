import prisma from "../lib/neon.js";

export async function Logout(req, res) {
  try {
    const userId = req.user?.user;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh: null,
      },
    });

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

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Unable to log out",
    });
  }
}
