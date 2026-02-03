import { getPublishedSermonsSSG } from "../lib/firebase/ssg-services";
import { Sermon } from "../lib/types/Sermon";
import ClientHomePage from "./ClientHomePage";
import type { Metadata } from "next";

// Configuração de cache para ISR
export const revalidate = 604800; // 7 dias em segundos
export const dynamic = "force-static";

// Metadata para SEO
export const metadata: Metadata = {
  title: "No'ah - Sermões e Devocionais",
  description:
    "Descubra uma coleção de sermões inspiradores e devocionais que vão fortalecer sua jornada de fé. Igreja No'ah - Compartilhando a Palavra de Deus.",
  keywords: [
    "sermões",
    "devocionais",
    "igreja",
    "fé",
    "estudos bíblicos",
    "palavra de deus",
    "noah",
  ],
  openGraph: {
    title: "No'ah - Sermões e Devocionais",
    description:
      "Descubra uma coleção de sermões inspiradores e devocionais da Igreja No'ah",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "No'ah - Sermões e Devocionais",
    description:
      "Descubra uma coleção de sermões inspiradores e devocionais da Igreja No'ah",
  },
};

// Esta função roda no servidor durante o build
async function getSermons(): Promise<{
  sermons: Sermon[];
  lastUpdated: string;
}> {
  try {
    // console.log("🏗️ SSG: Building homepage with static data...");

    const sermons = await getPublishedSermonsSSG();

    return {
      sermons,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    // console.error("❌ SSG: Error building homepage:", error);

    // Em caso de erro, retorna dados vazios mas não quebra o build
    return {
      sermons: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

export default async function HomePage() {
  const { sermons, lastUpdated } = await getSermons();

  return <ClientHomePage sermons={sermons} lastUpdated={lastUpdated} />;
}
