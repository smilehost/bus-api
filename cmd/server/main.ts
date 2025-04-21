import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.use(express.json());

app.get('/', async (req, res) => {
  const priceTypes = await prisma.price_type.findMany();
    res.json(priceTypes);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});