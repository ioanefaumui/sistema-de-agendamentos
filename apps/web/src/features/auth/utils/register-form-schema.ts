"use client";

import { z } from "zod";

export const registerFormSchema = z
  .object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(1, { message: "Insira sua senha" }),
    passwordCopy: z.string().min(1, { message: "Insira sua senha novamente" }),
  })
  .refine((data) => data.password === data.passwordCopy, {
    message: "Senhas não são iguais",
    path: ["passwordCopy"],
  });
