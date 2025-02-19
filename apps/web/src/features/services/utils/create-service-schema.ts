"use client";

import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, { message: "Insiria o nome do serviço" }),
  duration: z
    .string()
    .min(1, { message: "A duração mínima deve ser 1 minuto" }),
  price: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});
