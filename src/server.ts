import express, { Request, Response } from 'express';
const cors = require('cors');
import { PrismaClient } from '../prisma/generated/client';
import { createOrderMercadoPago, createOrderPayPal, receiveWebhook } from './controllers/PaymentController';
import { createAccount } from './controllers/ApiController';

const app = express();
app.use(cors());

export const prisma = new PrismaClient();

app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
})

app.post('/register', createAccount);
app.post('/buy-code-mp', createOrderMercadoPago);
app.post('/buy-code-pp', createOrderPayPal);
app.get('/sucess', (req: Request, res: Response) => res.send("Sucess"));
app.get('/failure', (req: Request, res: Response) => res.send("Failure"));
app.get('/pending', (req: Request, res: Response) => res.send("Pending"));
app.post('/webhook', receiveWebhook);



app.listen(3334, () => {
  console.log('Servidor rodando na porta 3334');
});