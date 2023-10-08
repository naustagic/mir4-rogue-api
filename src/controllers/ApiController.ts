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

  try {
    const response = await axios.post('https://www.roguemir4.com/register.php', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Algo de errado aconteceu." });
  }
}

export const recoverPassword = async (req: Request, res: Response) => {
  const data = {
    account: req.body.account,
    password: req.body.password,
    password2: req.body.confirmPassword,
    question: req.body.question,
    answer: req.body.answer,
    'g-recaptcha-response': req.body.code,
    lang: 'en'
  }

  console.log(data);

  try {
    const response = await axios.post('https://www.roguemir4.com/password.php', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Algo de errado aconteceu." });
  }
}
