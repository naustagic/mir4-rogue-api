import mercadopage from 'mercadopago';
import { prisma } from '../server';
import { Request, Response } from 'express';
import { config } from "dotenv";
import { SentMessageInfo } from 'nodemailer';
const nodemailer = require('nodemailer');
config();



const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'roguemarketmir4@gmail.com',
    pass: 'bglm arum kcit kqxo',
  },
});

export const MERCADOPAGO_TOKEN = process.env.MERCADOPAGO_TOKEN;
let cupomPrice: number;
let price: number;
let email: string;

const basePayPal = "https://api-m.sandbox.paypal.com";

export const createOrderMercadoPago = async (req: Request, res: Response) => {
  cupomPrice = req.body.cupom;
  price = req.body.price;
  email = req.body.email;

  const findCode = await prisma.code.findFirst({
    where: {
      price,
      emailOwner: {
        equals: ''
      }
    }
  })

  if (price && email && findCode) {
    mercadopage.configure({
      access_token: String(MERCADOPAGO_TOKEN)
    });
  
    const result = await mercadopage.preferences.create({
      items: [
        {
          title: `Código de R$ ${price},00 - Rogue Market`,
          unit_price: cupomPrice,
          currency_id: "BRL",
          quantity: 1,
        }
      ],
      payment_methods: {
        excluded_payment_types: [
          {
            id: "credit_card"
          },
          {
            id: "ticket"
          },
          {
            id: "debit_card"
          },
        ]
      },
      back_urls: {
        success: "http://localhost:3334/sucess",
        failure: "http://localhost:3334/failure",
        pending: "http://localhost:3334/pending"
      },
      notification_url: "https://0406-181-191-113-255.ngrok.io/webhook"
    })
  
    console.log(result);
    res.json(result.body);
  } else {
    return res.status(500).json({ message: "Algo de errado aconteceu." });
  }

}

export const receiveWebhook = async (req: Request, res: Response) => {
  try {
    const payment = req.query;
    const emailToInvite = email;
    let inviteCode = null;
    console.log(payment);
    if (payment.type === "payment") {
      const data = await mercadopage.payment.findById(Number(payment["data.id"]));
      data.body.status === "approved" ? inviteCode = true : false;
    }

    if (inviteCode) {
      const findCode = await prisma.code.findFirst({
        where: {
          price,
          emailOwner: {
            equals: ''
          }
        }
      })

      const codeInviteMail = await prisma.code.update({
        where: {
          id: findCode?.id

        },
        data: {
          emailOwner: emailToInvite
        }
      })

      const mailOptions = {
        from: 'roguetmarketmir4@gmail.com',
        to: `${emailToInvite}`,
        subject: 'RG MARKET - Confira seu código de resgate',
        text: `Segue seu código de resgate: CardCode = ${codeInviteMail?.cardCode}, CardPassword = ${codeInviteMail?.cardPassword}`,
      };

      transporter.sendMail(mailOptions, (error: Error | null , info: SentMessageInfo) => {
        if (error) {
          console.error('Erro ao enviar o e-mail:', error);
        } else {
          console.log('E-mail enviado com sucesso:', info.response);
        }
      });
    }
    
    res.sendStatus(204);
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Algo de errado aconteceu." });
  }
};

async function generateAccessToken() {
  const response = await fetch(basePayPal + "/v1/oauth2/token", {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization:
        "Basic " + Buffer.from(process.env.PAYPAL_API_CLIENT + ":" + process.env.PAYPAL_API_SECRET).toString("base64"),
    },
  });
  const data = await response.json();
  return data.access_token;
}

export async function createOrderPayPal() {
  const accessToken = await generateAccessToken();
  const url = `${basePayPal}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "BRL",
            value: "100.00",
          },
        },
      ],
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
}

export async function capturePaymentPayPal(orderId: string) {
  const accessToken = await generateAccessToken();
  const url = `${basePayPal}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}



