import express from "express";
import cors from "cors";
import fs from "fs";
import https from "https";
import { PrismaClient } from "@prisma/client";
import { Routes } from "./routes";

import path from "path";

const keyPath = path.resolve(process.cwd(), "certs", "key.pem");
const certPath = path.resolve(process.cwd(), "certs", "cert.pem");

const key = fs.readFileSync(keyPath);
const cert = fs.readFileSync(certPath);

const app = express();
const port = 8000;
const prisma = new PrismaClient();

app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["Authorization"], // 👈 เพิ่มบรรทัดนี้
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Secure World!!!!");
});

app.use("/api", Routes(prisma));

// ✅ HTTPS server
https.createServer({ key, cert }, app).listen(port, () => {
  console.log(`✅ Server running at https://localhost:${port}`);
});