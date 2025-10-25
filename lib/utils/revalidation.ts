// lib/utils/revalidation.ts

/**
 * Força a revalidação das páginas estáticas quando um sermão é publicado/despublicado
 */
export async function triggerRevalidation(
  type: "sermon-published" | "sermon-unpublished",
  sermonId?: string
) {
  try {
    console.log("🔄 Triggering manual revalidation...", { type, sermonId });

    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, sermonId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Revalidation failed");
    }

    const result = await response.json();
    console.log("✅ Manual revalidation successful:", result);

    return result;
  } catch (error) {
    console.error("❌ Manual revalidation failed:", error);
    throw error;
  }
}

/**
 * Hook personalizado para usar revalidação com notificações
 */
export function useRevalidation() {
  const revalidateOnPublish = async (sermonId: string) => {
    try {
      await triggerRevalidation("sermon-published", sermonId);
      console.log(
        "🎉 Novo sermão publicado! Cache atualizado automaticamente."
      );
    } catch (error) {
      console.error("Erro ao atualizar cache:", error);
      // Mesmo se a revalidação falhar, o sermão foi publicado
      // A próxima visita às páginas vai mostrar o conteúdo atualizado
    }
  };

  const revalidateOnUnpublish = async (sermonId: string) => {
    try {
      await triggerRevalidation("sermon-unpublished", sermonId);
      console.log("📝 Sermão despublicado! Cache atualizado automaticamente.");
    } catch (error) {
      console.error("Erro ao atualizar cache:", error);
    }
  };

  return {
    revalidateOnPublish,
    revalidateOnUnpublish,
  };
}
