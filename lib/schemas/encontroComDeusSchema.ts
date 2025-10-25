import { z } from "zod";

export const encontroComDeusSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

  phoneNumber: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(11, "Telefone deve ter no máximo 11 dígitos")
    .regex(/^\d{10,11}$/, "Telefone deve conter apenas números"),

  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),

  age: z
    .number()
    .min(1, "Idade deve ser maior que 0")
    .max(120, "Idade deve ser menor que 120")
    .int("Idade deve ser um número inteiro"),

  address: z
    .string()
    .min(5, "Endereço deve ter pelo menos 5 caracteres")
    .max(200, "Endereço deve ter no máximo 200 caracteres")
    .optional(),

  observations: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional(),

  typeOfParticipation: z.enum(["firstTime", "returning", "leadership"], {
    message: "Selecione um tipo de participação válido",
  }),
});

export type EncontroComDeusFormData = z.infer<typeof encontroComDeusSchema>;
