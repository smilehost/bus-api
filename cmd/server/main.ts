import { PrismaClient } from '@prisma/client';
import cors from 'cors'; // 👉 import cors
import express from 'express';
import { Routes } from './routes';

const app = express();
const port = process.env.PORT ?? 3000;
const prisma = new PrismaClient();

app.use(cors({
  // origin: ['http://localhost:3000'],
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!!!!');
}
);
app.use('/api', Routes(prisma));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});