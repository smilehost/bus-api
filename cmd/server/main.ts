import express from "express";
import cors from "cors";
import fs from "fs";
import https from "https";
import { PrismaClient } from "@prisma/client";
import { Routes } from "./routes";
import dotenv from "dotenv";
dotenv.config();

import path from "path";

const keyPath = path.resolve(process.cwd(), "certs", "key.pem");
const certPath = path.resolve(process.cwd(), "certs", "cert.pem");

const key = fs.readFileSync(keyPath);
const cert = fs.readFileSync(certPath);

const app = express();
const port = process.env.PORT ?? 3000;
const prisma = new PrismaClient();

app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Secure World!!!!--++60");
});

app.get("/areYouPay", (req, res) => {
  const { monney } = req.query;

  res.send("pay successfully");
});

app.use("/api", Routes(prisma));

// ✅ HTTPS server
https.createServer({ key, cert }, app).listen(port, () => {
  console.log(`✅ Server running at https://localhost:${port}`);
});
