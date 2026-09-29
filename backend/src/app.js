import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes/apiRoute.js";
import dotenv from "dotenv"
import Auth from "./routes/auth.js"
import cookieParser from "cookie-parser";
import { Refresh } from "./controller/Refresh.js";


dotenv.config()
const app = express();
console.log(process.env.FRONTEND_URL)
app.use(cookieParser());

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" ,
  credentials:true
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

  

app.use("/api",router)
app.use("/api/auth",Auth)
app.use("/api/refresh",Refresh)
export default app;
