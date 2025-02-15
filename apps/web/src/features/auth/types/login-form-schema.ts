import { z } from "zod";
import { loginFormSchema } from "../utils";

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
