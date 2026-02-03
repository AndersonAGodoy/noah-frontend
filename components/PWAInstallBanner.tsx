"use client";

import {
  Button,
  Paper,
  Text,
  Group,
  CloseButton,
  Modal,
  Stack,
  List,
} from "@mantine/core";
import {
  IconDownload,
  IconDeviceMobile,
  IconDotsVertical,
} from "@tabler/icons-react";
import { usePWAInstall } from "../lib/hooks/usePWAInstall";
import { useState, useEffect } from "react";

export function PWAInstallBanner() {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Verificar se o usuário rejeitou explicitamente
    const isRejected = localStorage.getItem("pwa-install-rejected") === "true";
    setDismissed(isRejected);
  }, []);

  const handleDismiss = () => {
    // Apenas fecha temporariamente (volta a aparecer na próxima página)
    setDismissed(true);
  };

  const handleReject = () => {
    // Rejeição explícita - salva no localStorage
    localStorage.setItem("pwa-install-rejected", "true");
    setDismissed(true);
    // Mostrar modal com instruções imediatamente
    setShowInstructions(true);
  };

  const handleInstall = () => {
    promptInstall();
    setDismissed(true);
  };

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  // Se o modal de instruções está aberto, renderizar apenas ele
  if (showInstructions) {
    return (
      <Modal
        opened={showInstructions}
        onClose={closeInstructions}
        title={
          <Text fw={700} size="lg">
            Como instalar o No&apos;ah
          </Text>
        }
        centered
        size="md"
      >
        <Stack gap="md">
          <Text size="sm">
            Você pode instalar o No&apos;ah manualmente a qualquer momento:
          </Text>

          <div>
            <Group gap={8} mb={8}>
              <IconDeviceMobile size={20} color="#7c3aed" />
              <Text size="sm" fw={600}>
                No celular (Android/iOS):
              </Text>
            </Group>
            <List size="sm" spacing="xs">
              <List.Item>
                Toque no menu do navegador (
                <IconDotsVertical
                  size={14}
                  style={{ display: "inline", verticalAlign: "middle" }}
                />{" "}
                ou ⋯)
              </List.Item>
              <List.Item>
                Selecione &quot;Adicionar à tela inicial&quot;
              </List.Item>
              <List.Item>Confirme a instalação</List.Item>
            </List>
          </div>

          <div>
            <Text size="sm" fw={600} mb={8}>
              💻 No computador (Chrome/Edge):
            </Text>
            <List size="sm" spacing="xs">
              <List.Item>
                Clique no ícone de instalação na barra de endereço
              </List.Item>
              <List.Item>Ou vá em Menu → Instalar No&apos;ah</List.Item>
            </List>
          </div>

          <Text size="xs" c="dimmed">
            Após instalado, você receberá notificações de novos conteúdos!
          </Text>

          <Button onClick={closeInstructions} fullWidth color="violet">
            Entendi
          </Button>
        </Stack>
      </Modal>
    );
  }

  if (!mounted || !isInstallable || dismissed) return null;

  return (
    <Paper
      p="md"
      shadow="lg"
      radius="md"
      withBorder
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 1000,
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <div style={{ flex: 1 }}>
          <Text fw={600} size="sm">
            Instalar No&apos;ah
          </Text>
          <Text size="xs" c="dimmed">
            Instale o app para acesso rápido e receba notificações de novos
            sermões
          </Text>
        </div>
        <Group gap="xs" wrap="nowrap">
          <Button
            variant="light"
            size="xs"
            onClick={handleInstall}
            leftSection={<IconDownload size={16} />}
          >
            Instalar
          </Button>
          <Button
            variant="subtle"
            size="xs"
            color="gray"
            onClick={handleReject}
          >
            Não
          </Button>
          <CloseButton onClick={handleDismiss} />
        </Group>
      </Group>
    </Paper>
  );
}
