"use client";

import { useEffect, useRef } from "react";
import { Box, Text, Group, Paper } from "@mantine/core";
import { useClientColorScheme } from "../lib/hooks/useClientColorScheme";

import { IconBrandSpotifyFilled } from "@tabler/icons-react";

interface SpotifyPlayerProps {
  spotifyUri: string; // formato: spotify:episode:ID
}

// Declaração de tipos para a API do Spotify
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
    Spotify?: any;
  }
}

export default function SpotifyPlayer({ spotifyUri }: SpotifyPlayerProps) {
  const { isDark } = useClientColorScheme();
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);

  // Validação do URI
  if (!spotifyUri || !spotifyUri.startsWith("spotify:")) {
    return null;
  }

  useEffect(() => {
    if (!spotifyUri || !embedContainerRef.current) return;

    // Verificar se o script já foi carregado
    const existingScript = document.querySelector(
      'script[src="https://open.spotify.com/embed/iframe-api/v1"]'
    );

    const initializePlayer = (IFrameAPI: any) => {
      const element = embedContainerRef.current;
      if (!element) return;

      try {
        const options = {
          width: "100%",
          height: "352",
          uri: spotifyUri,
        };

        const callback = (EmbedController: any) => {
          controllerRef.current = EmbedController;
        };

        IFrameAPI.createController(element, options, callback);
      } catch (error) {
        console.error("❌ Erro ao criar player Spotify:", error);
      }
    };

    // Função chamada quando a API estiver pronta
    window.onSpotifyIframeApiReady = initializePlayer;

    if (!existingScript && !scriptLoadedRef.current) {
      // Adicionar o script da API do Spotify
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
      };
      script.onerror = () => {
        console.error("❌ Erro ao carregar script do Spotify");
      };
      document.body.appendChild(script);
    } else if (window.Spotify) {
      // Se a API já estiver carregada, inicializar imediatamente
      initializePlayer(window.Spotify);
    }

    // Cleanup
    return () => {
      if (controllerRef.current) {
        try {
          controllerRef.current.destroy?.();
          controllerRef.current = null;
        } catch (error) {
          // Silencioso - pode já ter sido destruído
        }
      }
    };
  }, [spotifyUri]);

  return (
    <Paper
      p="xl"
      radius="xl"
      bg={isDark ? "dark.7" : "gray.0"}
      mb="xl"
      style={{
        border: `2px solid ${isDark ? "#7950f2" : "#5f3dc4"}`,
        boxShadow: isDark
          ? "0 8px 32px rgba(121, 80, 242, 0.15)"
          : "0 8px 32px rgba(95, 61, 196, 0.1)",
      }}
    >
      <Group gap="md" mb="lg" align="center">
        <Box
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: isDark
              ? "linear-gradient(135deg, #7950f2 0%, #5f3dc4 100%)"
              : "linear-gradient(135deg, #7950f2 0%, #5f3dc4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
          }}
        >
          <IconBrandSpotifyFilled size={24} color="white" />
        </Box>
        <Box>
          <Text size="lg" fw={700} c={isDark ? "violet.3" : "violet.7"}>
            Não tem tempo para ler?
          </Text>
          <Text size="sm" c={isDark ? "gray.5" : "gray.6"}>
            Ouça este Sermão
          </Text>
        </Box>
      </Group>

      <Box
        ref={embedContainerRef}
        id="spotify-embed-container"
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.1)",
          minHeight: "352px",
        }}
      />
    </Paper>
  );
}
