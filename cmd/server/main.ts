import "reflect-metadata";
import express from "express";
import cors from "cors";
import { Routes } from "./routes";
import "./di"; // 👈 สำคัญ ต้อง import มาด้วยเพื่อ register DI

const app = express();
const port = process.env.PORT ?? 3000;

app.disable("x-powered-by");

app.use(
  cors({ origin: true, credentials: true, exposedHeaders: ["Authorization"] })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello Secure World!!!!!!3");
});

app.use("/", Routes());

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
