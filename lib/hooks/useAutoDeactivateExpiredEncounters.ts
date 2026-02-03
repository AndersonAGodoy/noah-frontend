// lib/hooks/useAutoDeactivateExpiredEncounters.ts
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { encountersService } from "../firebase/services";

/**
 * Hook que verifica e desativa automaticamente encontros cuja data já passou
 * Roda periodicamente para manter a base de dados limpa
 */
export const useAutoDeactivateExpiredEncounters = () => {
  return useQuery({
    queryKey: ["deactivateExpiredEncounters"],
    queryFn: async () => {
      try {
        // Buscar todos os encontros ativos
        const encounters = await encountersService.getEncounters(100, 1);
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Verificar cada encontro ativo
        for (const encounter of encounters.data) {
          if (encounter.isActive) {
            const encounterDate = encounter.startDate instanceof Date 
              ? encounter.startDate 
              : encounter.startDate.toDate();
            
            encounterDate.setHours(0, 0, 0, 0);

            // Se a data já passou, desativar
            if (encounterDate < now) {
              // console.log(`🔄 Desativando encontro expirado: ${encounter.title}`);
              await encountersService.updateEncounter(encounter.id, {
                isActive: false,
              });
            }
          }
        }

        return { success: true, checkedAt: new Date().toISOString() };
      } catch (error) {
        // console.error("Erro ao desativar encontros expirados:", error);
        return { success: false, error };
      }
    },
    // Executar a cada 1 hora
    refetchInterval: 1000 * 60 * 60,
    // Executar ao montar o componente
    refetchOnMount: true,
    // Não refetch em background automaticamente (apenas no intervalo)
    refetchOnWindowFocus: false,
  });
};
