import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { Routes } from "./routes";
import path from "path";

const app = express();
const port = process.env.PORT ?? 3000;
const prisma = new PrismaClient();

app.disable("x-powered-by");

app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.originalUrl}`);
  next();
});

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

app.get("/qr", (_, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="th">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>QR Code</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f5f5f5;
            font-family: sans-serif;
          }
          img {
            width: 90%;
            max-width: 350px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          }
        </style>
      </head>
      <body>
        <img src="/api/qr.jpg" alt="QR Code" />
      </body>
    </html>
  `);
});

app.get("/areYouPay", (req, res) => {
  const { money } = req.query as { money: string };

  res.json({
    message: `Pay Successfully`,
    amount: money,
  });
});

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

app.use("/", Routes(prisma));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
