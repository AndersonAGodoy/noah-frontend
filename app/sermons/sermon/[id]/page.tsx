import {
  getSermonByIdSSG,
  getAllSermonIdsSSG,
} from "../../../../lib/firebase/ssg-services";
import { Sermon } from "../../../../lib/types/Sermon";
import { notFound } from "next/navigation";
import ClientSermonPage from "./ClientSermonPage";

// Configuração de cache para ISR
export const revalidate = 604800; // 7 dias em segundos
export const dynamicParams = true; // Permite gerar páginas para novos sermões sob demanda

// Gerar parâmetros estáticos para todos os sermões publicados
export async function generateStaticParams() {
  try {
    console.log("🏗️ SSG: Generating static params for sermons...");

    const sermonIds = await getAllSermonIdsSSG();

    return sermonIds.map((id) => ({
      id,
    }));
  } catch (error) {
    console.error("❌ SSG: Error generating static params:", error);
    return [];
  }
}

interface SermonPageProps {
  params: {
    id: string;
  };
}

async function getSermon(
  id: string
): Promise<{ sermon: Sermon | null; lastUpdated: string }> {
  try {
    console.log(`🏗️ SSG: Building sermon page for ID: ${id}`);

    const sermon = await getSermonByIdSSG(id);

    if (!sermon || !sermon.isPublished) {
      return {
        sermon: null,
        lastUpdated: new Date().toISOString(),
      };
    }

    return {
      sermon,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`❌ SSG: Error building sermon page for ${id}:`, error);

    return {
      sermon: null,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export default async function SermonPage({ params }: SermonPageProps) {
  const { sermon, lastUpdated } = await getSermon(params.id);

  if (!sermon) {
    notFound();
  }

  return <ClientSermonPage sermon={sermon} lastUpdated={lastUpdated} />;
}
