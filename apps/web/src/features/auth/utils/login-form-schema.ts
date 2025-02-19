"use client";

import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Insira sua senha" }),
});
