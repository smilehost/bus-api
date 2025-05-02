import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { Routes } from "./routes";

const app = express();
const port = process.env.PORT ?? 3000;
const prisma = new PrismaClient();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // ✅ สำคัญมาก

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.use("/api", Routes(prisma));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});