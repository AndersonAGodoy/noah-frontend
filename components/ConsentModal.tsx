"use client";

import { Modal, Text, Button, Stack, List, Alert } from "@mantine/core";
import { IconShieldCheck, IconAlertCircle } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { requestNotificationPermission } from "../lib/firebase/messaging";
import { saveFCMToken } from "../lib/firebase/services/fcmTokensService";

export function ConsentModal() {
  const [opened, setOpened] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [showError, setShowError] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Não mostrar modal na página de política de privacidade
    if (pathname === "/politica-privacidade") {
      return;
    }

    // Verificar se já deu consentimento
    const consent = localStorage.getItem("notification-consent");
    if (!consent && "Notification" in window) {
      // Mostrar modal após 2 segundos
      setTimeout(() => setOpened(true), 2000);
    }
  }, [pathname]);

  const handleAccept = async () => {
    setIsActivating(true);
    setShowError(false);

    try {
      // Solicitar permissão de notificação
      const token = await requestNotificationPermission();

      if (!token) {
        // Usuário negou a permissão no popup do navegador
        // console.warn("⚠️ Permissão de notificação negada no navegador");
        setShowError(true);
        setIsActivating(false);
        return;
      }

      // console.log("🔑 Token FCM obtido:", token);

      // Salvar token no Firestore
      await saveFCMToken(token);

      // Salvar consentimento
      localStorage.setItem("notification-consent", "true");
      localStorage.setItem(
        "notification-consent-date",
        new Date().toISOString(),
      );

      // console.log("✅ Notificações ativadas com sucesso!");
      setOpened(false);
    } catch (error) {
      // console.error("❌ Erro ao ativar notificações:", error);
      setShowError(true);
      setIsActivating(false);
    }
  };

  const handleReject = () => {
    localStorage.setItem("notification-consent", "false");
    setOpened(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      zIndex={2000}
      title={
        <Text fw={700} size="lg">
          Notificações e Privacidade
        </Text>
      }
      centered
      size="md"
    >
      <Stack gap="md">
        <Text size="sm">
          Gostaríamos de enviar notificações sobre novos sermões e conteúdos.
        </Text>

        <Text size="sm" fw={600}>
          Dados que coletamos:
        </Text>
        <List size="sm" spacing="xs">
          <List.Item>
            Token de notificação (identificador do dispositivo)
          </List.Item>
          <List.Item>Informações do navegador e sistema operacional</List.Item>
          <List.Item>Data de instalação do app</List.Item>
        </List>

        <Text size="sm">
          <strong>Seus direitos (LGPD):</strong> Você pode revogar este
          consentimento a qualquer momento nas configurações do navegador ou
          solicitar exclusão dos seus dados.
        </Text>

        <Text size="xs" c="dimmed">
          Ao aceitar, você concorda com nossa{" "}
          <Text
            component="a"
            href="/politica-privacidade"
            target="_blank"
            c="violet"
            td="underline"
            style={{ cursor: "pointer" }}
          >
            Política de Privacidade
          </Text>
          .
        </Text>

        {showError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            <Text size="sm">
              Você precisa <strong>permitir</strong> as notificações no popup do
              navegador. Clique novamente em &quot;Aceitar&quot; e depois em{" "}
              <strong>Permitir</strong> quando o navegador perguntar.
            </Text>
          </Alert>
        )}

        <Stack gap="xs">
          <Button
            onClick={handleAccept}
            leftSection={<IconShieldCheck size={16} />}
            loading={isActivating}
          >
            Aceitar e Ativar Notificações
          </Button>
          <Button
            variant="subtle"
            onClick={handleReject}
            disabled={isActivating}
          >
            Não, obrigado
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
