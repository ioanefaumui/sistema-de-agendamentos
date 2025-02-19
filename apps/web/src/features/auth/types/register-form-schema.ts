import { z } from "zod";
import { registerFormSchema } from "../utils";

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
