import jwt from "jsonwebtoken";

export function verify(req, res, next) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET_ACCESS, {
      algorithms: ["HS256"],
    });
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  next();
}