import { getPublishedSermonsSSG } from "../lib/firebase/ssg-services";
import { Sermon } from "../lib/types/Sermon";
import ClientHomePage from "./ClientHomePage";

// Configuração de cache para ISR
export const revalidate = 604800; // 7 dias em segundos
export const dynamic = "force-static";

// Esta função roda no servidor durante o build
async function getSermons(): Promise<{
  sermons: Sermon[];
  lastUpdated: string;
}> {
  try {
    console.log("🏗️ SSG: Building homepage with static data...");

    const sermons = await getPublishedSermonsSSG();

    return {
      sermons,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ SSG: Error building homepage:", error);

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
