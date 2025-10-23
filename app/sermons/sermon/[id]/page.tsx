import {
  getSermonByIdSSG,
  getAllSermonIdsSSG,
} from "../../../../lib/firebase/ssg-services";
import { Sermon } from "../../../../lib/types/Sermon";
import { notFound } from "next/navigation";
import ClientSermonPage from "./ClientSermonPage";

// Configuração de cache para ISR
export const revalidate = 604800; // 7 dias em segundos (604800 segundos = 7 dias)
export const dynamicParams = true; // Permite gerar páginas para novos sermões sob demanda
export const dynamic = "force-static"; // Força geração estática
export const fetchCache = "force-cache"; // Força uso de cache no fetch

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
  params: Promise<{
    id: string;
  }>;
}

async function getSermon(
  id: string
): Promise<{ sermon: Sermon | null; lastUpdated: string; buildTime: string }> {
  try {
    const buildTime = new Date().toISOString();
    console.log(`🏗️ SSG: Building sermon page for ID: ${id} at ${buildTime}`);
    console.log(`⏰ Revalidation configured for: 7 days (604800 seconds)`);

    const sermon = await getSermonByIdSSG(id);

    if (!sermon || !sermon.isPublished) {
      return {
        sermon: null,
        lastUpdated: buildTime,
        buildTime,
      };
    }

    console.log(`✅ SSG: Successfully built sermon page for ID: ${id}`);
    return {
      sermon,
      lastUpdated: buildTime,
      buildTime,
    };
  } catch (error) {
    console.error(`❌ SSG: Error building sermon page for ${id}:`, error);

    return {
      sermon: null,
      lastUpdated: new Date().toISOString(),
      buildTime: new Date().toISOString(),
    };
  }
}

export default async function SermonPage({ params }: SermonPageProps) {
  // Aguarda a Promise de params antes de usar suas propriedades
  const { id } = await params;
  const { sermon, lastUpdated, buildTime } = await getSermon(id);

  if (!sermon) {
    notFound();
  }

  console.log(
    `📄 Rendering sermon page ${id} - Build time: ${buildTime} - Last updated: ${lastUpdated}`
  );

  return <ClientSermonPage sermon={sermon} lastUpdated={lastUpdated} />;
}
