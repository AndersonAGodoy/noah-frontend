"use client";

import { useScrollToTop } from "../lib/hooks/useScrollToTop";

/**
 * Componente que implementa scroll automático para o topo em mudanças de rota
 * Deve ser usado dentro do layout principal da aplicação
 */
export const ScrollToTopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useScrollToTop();

  return <>{children}</>;
};
