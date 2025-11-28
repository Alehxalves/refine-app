import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

export type SignInInput = z.infer<typeof SignInSchema>;
