export type ScriptureReference = {
  id?: string;
  reference: string;
  text: string;
};

export type ContentSection = {
  id?: string;
  type: "parágrafo" | "título" | "lista" | "citacao";
  content: string;
};

export type Sermon = {
  id: string;
  title: string;
  description: string;
  speaker: string;
  duration?: string;
  date: string;
  time?: string;
  eventType: "Culto" | "Estudo Bíblico" | "Retiro" | "Conferência" | "Outro";
  isPublished: boolean;
  references: ScriptureReference[];
  contentSections: ContentSection[];
  markdownContent?: string; // Novo campo para conteúdo em markdown
  spotifyEmbed?: string; // URL do embed do Spotify
  createdAt?: string | Date | { toDate(): Date }; // Aceita string (SSG) ou Date/Timestamp (runtime)
  updatedAt?: string | Date | { toDate(): Date }; // Aceita string (SSG) ou Date/Timestamp (runtime)
  publishedAt?: string | Date | { toDate(): Date }; // Aceita string (SSG) ou Date/Timestamp (runtime)
};

export type SermonPage = {
  data: Sermon[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
