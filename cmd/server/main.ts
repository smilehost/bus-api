import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { Routes } from "./routes";

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
  res.send("Hello Secure World!!!!!!");
});

app.get("/areYouPay", (req, res) => {
  const { monney } = req.query;

  res.json({
    message: `Pay Successfully`,
    amonut: monney,
  });
});

app.use("/api", Routes(prisma));

app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});
