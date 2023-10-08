import express, { Request, Response } from 'express';
const cors = require('cors');
import { PrismaClient } from '../prisma/generated/client';
// import { createOrderMercadoPago, createOrderPayPal, receiveWebhook } from './controllers/PaymentController';
import { createAccount } from './controllers/ApiController';

const app = express();

const corsOptions = {
  origin: 'https://mir4-rogue.com',
};
app.use(cors(corsOptions));

export const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Conectado com sucesso' });
})

app.post('/register', createAccount);
// app.post('/buy-code-mp', createOrderMercadoPago);
// app.post('/buy-code-pp', createOrderPayPal);
// app.get('/sucess', (req: Request, res: Response) => res.send("Sucess"));
// app.get('/failure', (req: Request, res: Response) => res.send("Failure"));
// app.get('/pending', (req: Request, res: Response) => res.send("Pending"));
// app.post('/webhook', receiveWebhook);



app.listen(8000, () => {
  console.log('Servidor rodando na porta 8000');
});