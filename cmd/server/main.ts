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
  res.send("Hello Secure World!!!!!!3");
});

const choices = {
  "1": "วันนี้",
  "2": "สัปดาห์นี้",
  "3": "เดือนนี้",
  "4": "ปีนี้",
  "5": "เลือกวัน",
};

app.get("/api/areYouPay/:choice", (req, res) => {
  const { choice } = req.params as { choice: keyof typeof choices };
  const day = req.query.day;
  const money = Number(req.query.money); // แปลงเป็น number

  if (!choices[choice]) {
    res.status(400).json({ message: "Invalid choice" });
  }

  if (choice === "5" && !day) {
    res
      .status(400)
      .json({ message: "Missing 'day' parameter for custom choice" });
  }

  const total = isNaN(money) ? 1000 : money;
  const cash = total / 2;
  const promtpay = total / 2;

  res.json({
    total,
    cash,
    promtpay,
  });
});

app.use("/api", Routes(prisma));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
