import { useQuery } from "@tanstack/react-query";
import { getAllFCMTokensWithDetails } from "../firebase/services/fcmTokensService";
import { auth } from "../firebase/config";
import { useEffect, useState } from "react";

export function useGetAllFCMTokens() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  return useQuery({
    queryKey: ["fcmTokens"],
    queryFn: getAllFCMTokensWithDetails,
    enabled: isAuthenticated, // Só buscar quando autenticado
    refetchInterval: 30000,
    staleTime: 15000,
  });
}
