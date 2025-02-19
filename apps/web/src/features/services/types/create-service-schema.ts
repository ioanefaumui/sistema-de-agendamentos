import { z } from "zod";
import { createServiceSchema } from "../utils";

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
