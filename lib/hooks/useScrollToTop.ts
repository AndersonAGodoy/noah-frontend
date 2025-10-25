import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook que faz scroll automático para o topo da página quando a rota muda
 * Útil para melhorar a experiência do usuário em navegação entre páginas
 */
export const useScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Pequeno delay para garantir que a página carregou
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // scroll instantâneo
      });
    };

    // Timeout para garantir que o DOM foi atualizado
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);
};

/**
 * Hook que faz scroll instantâneo para o topo (sem animação)
 * Usado quando precisamos de scroll imediato
 */
export const useInstantScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

/**
 * Função utilitária para fazer scroll manual para o topo
 * @param smooth - se true, usa scroll suave. Se false, scroll instantâneo
 */
export const scrollToTop = (smooth: boolean = true) => {
  if (smooth) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // scroll instantâneo
    });
  } else {
    window.scrollTo(0, 0);
  }
};

/**
 * Hook para scroll suave para um elemento específico
 * @param elementId - ID do elemento para fazer scroll
 */
export const useScrollToElement = (elementId: string) => {
  const scrollToElement = () => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "instant", // scroll instantâneo
        block: "start",
      });
    }
  };

  return scrollToElement;
};
