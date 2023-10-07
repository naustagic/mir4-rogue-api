import axios from "axios";
import { Request, Response } from "express";


export const createAccount = async (req: Request, res: Response) => {
  const data = {
    account: req.body.account,
    password: req.body.password,
    password2: req.body.confirmPassword,
    question: req.body.question,
    answer: req.body.answer,
    'g-recaptcha-response': req.body.code,
    d: req.body.d,
    lang: 'en'
  }

  console.log(data);

  const response = await axios.post('https://www.roguemir4.com/register.php', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  console.log(response.data);
}
