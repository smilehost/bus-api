// src/di.ts
import { container } from "tsyringe";
import { PrismaClient } from "@prisma/client";

// สร้าง Prisma และ register ให้ tsyringe ใช้งานได้ทุกที่
const prisma = new PrismaClient();
container.registerInstance(PrismaClient, prisma);