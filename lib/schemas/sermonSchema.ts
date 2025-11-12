import { z } from "zod";

const scriptureReferenceSchema = z.object({
  id: z.string().optional(),
  reference: z
    .string()
    .min(1, "Referência bíblica é obrigatória")
    .max(100, "Referência deve ter no máximo 100 caracteres"),
  text: z
    .string()
    .min(1, "Texto da referência é obrigatório")
    .max(1000, "Texto deve ter no máximo 1000 caracteres"),
});

const contentSectionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["parágrafo", "título", "lista", "citacao"], {
    message: "Tipo de conteúdo inválido",
  }),
  content: z
    .string()
    .min(1, "Conteúdo é obrigatório")
    .max(2000, "Conteúdo deve ter no máximo 2000 caracteres"),
});

export const sermonSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),

  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),

  speaker: z
    .string()
    .min(2, "Nome do pregador deve ter pelo menos 2 caracteres")
    .max(100, "Nome do pregador deve ter no máximo 100 caracteres"),

  duration: z
    .string()
    .regex(/^\d{1,2}:\d{2}$/, "Duração deve estar no formato HH:MM")
    .optional()
    .or(z.literal("")),

  date: z
    .string()
    .min(1, "Data é obrigatória")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),

  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Horário deve estar no formato HH:MM")
    .optional()
    .or(z.literal("")),

  eventType: z.enum(
    ["Culto", "Estudo Bíblico", "Retiro", "Conferência", "Outro"],
    {
      message: "Tipo de evento inválido",
    }
  ),

  references: z.array(scriptureReferenceSchema).optional().default([]),

  contentSections: z.array(contentSectionSchema).optional().default([]),

  markdownContent: z
    .string()
    .min(10, "Conteúdo do sermão deve ter pelo menos 10 caracteres")
    .optional()
    .or(z.literal("")),

  spotifyEmbed: z
    .string()
    .regex(
      /^spotify:(episode|track|album|playlist|show):[a-zA-Z0-9]+$/,
      "URI do Spotify inválido. Use o formato: spotify:episode:ID ou spotify:track:ID"
    )
    .optional()
    .or(z.literal("")),
});

export const updateSermonSchema = sermonSchema.extend({
  id: z.string().optional(),
});

export type SermonFormData = z.infer<typeof sermonSchema>;
export type UpdateSermonFormData = z.infer<typeof updateSermonSchema>;
