import prisma from "../lib/neon.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { GenerateToken } from "../token/generateToken.js";

dotenv.config();

const pepper = process.env.PEPPER;
const SALT_ROUNDS = 10;

export async function Signup(req, res) {
  const { name, email, password } = req.body ?? {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password.trim()
  ) {
    return res.status(400).json({
      message: "All data is required",
    });
  }

  if (name.trim().length <= 3 || password.length < 8) {
    return res.status(400).json({
      message: "Name must be longer than 3 characters and password at least 8 characters",
    });
  }

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      message: "Enter a valid email address",
    });
  }

  if (!pepper) {
    return res.status(500).json({
      message: "PEPPER is not configured",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User is already registered",
      });
    }

    const pepperedPassword = password + pepper;

    const hashedPassword = await bcrypt.hash(
      pepperedPassword,
      SALT_ROUNDS
    );

    await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        isVerified:false
      },
      select: {
        name: true,
        id: true,
      },
    });



    return res.status(201).json({
      message: "User signed up successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "User cannot be signed up. Try again later.",
    });
  }
}