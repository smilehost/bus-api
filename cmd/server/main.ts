import { PrismaClient } from '@prisma/client';
import express from 'express';
import { Routes } from './routes';

const app = express();
const port = process.env.PORT ?? 3000;
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api', Routes(prisma));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});