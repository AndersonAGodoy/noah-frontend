import {
  getSermonByIdSSG,
  getAllSermonIdsSSG,
} from "../../../../lib/firebase/ssg-services";
import { Sermon } from "../../../../lib/types/Sermon";
import { notFound } from "next/navigation";
import ClientSermonPage from "./ClientSermonPage";

// Configuração de cache para SSG com ISR
export const revalidate = 604800; // 7 dias em segundos (604800 segundos = 7 dias)
export const dynamicParams = true; // Permite gerar páginas que não estavam no build - ISR
// Removido: dynamic = "force-static" - conflita com generateStaticParams
// Removido: fetchCache - não necessário com SSG puro

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

// Timestamp fixo gerado no build - prova que é SSG
const BUILD_TIMESTAMP = new Date().toISOString();

async function getSermon(
  id: string
): Promise<{ sermon: Sermon | null; lastUpdated: string; buildTime: string }> {
  try {
    // Usa timestamp fixo do build, não do request
    console.log(
      `🏗️ SSG: Building sermon page for ID: ${id} at ${BUILD_TIMESTAMP}`
    );
    console.log(`⏰ Revalidation configured for: 7 days (604800 seconds)`);

    const sermon = await getSermonByIdSSG(id);

    if (!sermon || !sermon.isPublished) {
      return {
        sermon: null,
        lastUpdated: BUILD_TIMESTAMP,
        buildTime: BUILD_TIMESTAMP,
      };
    }

    console.log(`✅ SSG: Successfully built sermon page for ID: ${id}`);
    return {
      sermon,
      lastUpdated: BUILD_TIMESTAMP,
      buildTime: BUILD_TIMESTAMP,
    };
  } catch (error) {
    console.error(`❌ SSG: Error building sermon page for ${id}:`, error);

    return {
      sermon: null,
      lastUpdated: BUILD_TIMESTAMP,
      buildTime: BUILD_TIMESTAMP,
    };
  }
}

export default async function SermonPage({ params }: SermonPageProps) {
  // Aguarda a Promise de params antes de usar suas propriedades
  const { id } = await params;

  console.log(`🔍 SermonPage: Requested sermon ID: ${id}`);

  const { sermon, lastUpdated, buildTime } = await getSermon(id);

  console.log(`📊 SermonPage: Sermon found:`, !!sermon);
  if (sermon) {
    console.log(`📊 SermonPage: Sermon published:`, sermon.isPublished);
    console.log(`📊 SermonPage: Sermon title:`, sermon.title);
  }

  if (!sermon) {
    console.log(`❌ SermonPage: Returning 404 for sermon ID: ${id}`);
    notFound();
  }

  console.log(
    `📄 Rendering sermon page ${id} - Build time: ${buildTime} - Last updated: ${lastUpdated}`
  );

  return <ClientSermonPage sermon={sermon} lastUpdated={lastUpdated} />;
}
