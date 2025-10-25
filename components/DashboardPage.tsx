"use client";
import {
  Title,
  Text,
  Box,
  Button,
  Notification,
  Stack,
  Group,
} from "@mantine/core";

import Link from "next/link";
import { useGetSermonsFirebase } from "../lib/hooks/useGetSermonsFirebase";
import useGetAllParticipantsFirebase from "../lib/hooks/useGetAllParticipantsFirebase";
import { useEffect, useMemo, useRef } from "react";
import StatsGrid from "./StatsGrid";
import useDeleteSermonFirebase, {
  usePublishSermonFirebase,
  useUnpublishSermonFirebase,
} from "../lib/hooks/useDeleteSermonFirebase";
import { modals } from "@mantine/modals";
import { notifications, showNotification } from "@mantine/notifications";
import LastSermons from "./LastSermons";
import useUpdateSermonFirebase from "../lib/hooks/useUpdateSermonFirebase";
import {
  IconCirclePlus,
  IconUsers,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { Sermon } from "../lib/types/Sermon";
import { useClientColorScheme } from "../lib/hooks/useClientColorScheme";
import { useGetActiveEncounter } from "../lib/hooks/useGetActiveEncounter";
import { useAutoDeactivateExpiredEncounters } from "../lib/hooks/useAutoDeactivateExpiredEncounters";

export default function DashboardPage() {
  const {
    data: sermonsData,
    isLoading,
    error,
  } = useGetSermonsFirebase({
    limit: 100,
  });

  // Buscar participantes reais do Firebase
  const { data: participantsData } = useGetAllParticipantsFirebase({
    limit: 100,
    page: 1,
  });

  // Buscar encontro ativo
  const { data: activeEncounter } = useGetActiveEncounter();

  // Desativar automaticamente encontros expirados
  useAutoDeactivateExpiredEncounters();

  const searchParams = useSearchParams();
  const created = searchParams?.get("created");
  const updated = searchParams?.get("updated");
  const deleteSermonMutation = useDeleteSermonFirebase();
  const publishSermonMutation = usePublishSermonFirebase();
  const unpublishSermonMutation = useUnpublishSermonFirebase();
  const { isDark } = useClientColorScheme();

  // Número real de inscrições no Encontro com Deus
  const encontroInscricoes = participantsData?.data?.length || 0;

  const allSermons = useMemo(() => {
    if (Array.isArray(sermonsData)) {
      return sermonsData;
    }
    return sermonsData?.data || [];
  }, [sermonsData]);

  const hasNotified = useRef(false);

  useEffect(() => {
    if ((created || updated) && !hasNotified.current) {
      showNotification({
        title: "Sucesso",
        message: "Sermão criado com sucesso!",
        color: "green",
      });

      hasNotified.current = true;

      // Limpar a query da URL
      window.history.replaceState({}, document.title, "/dashboard");
    }

    if (updated && !hasNotified.current) {
      showNotification({
        title: "Sucesso",
        message: "Sermão atualizado com sucesso!",
        color: "violet",
      });

      hasNotified.current = true;

      // Limpar a query da URL
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [created, updated]);

  const openConfirmModal = (sermonId: string) => {
    modals.openConfirmModal({
      title: "Confirmar exclusão",
      children: (
        <Text size="sm">
          Tem certeza que deseja excluir este sermão? <br />
          <strong>Essa ação não poderá ser desfeita.</strong>
        </Text>
      ),
      labels: { confirm: "Deletar", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteSermonMutation.mutateAsync(sermonId);
          notifications.show({
            title: "Sermão deletado",
            message: "O sermão foi removido com sucesso.",
            color: "green",
          });
        } catch (err) {
          notifications.show({
            title: "Erro",
            message: "Falha ao deletar o sermão.",
            color: "red",
          });
        }
      },
    });
  };

  const handlePublish = async (sermonId: string) => {
    modals.openConfirmModal({
      title: "Publicar Sermão",
      children: (
        <Text size="sm">
          Tem certeza que deseja publicar este sermão? <br />
          <strong>Depois de publicado, não será possível editá-lo mais.</strong>
        </Text>
      ),
      labels: { confirm: "Publicar", cancel: "Cancelar" },
      confirmProps: { color: "violet" },
      onConfirm: async () => {
        try {
          await publishSermonMutation.mutateAsync(sermonId);
          notifications.show({
            title: "Sermão publicado",
            message: "O sermão foi publicado com sucesso.",
            color: "green",
          });
        } catch (err) {
          notifications.show({
            title: "Erro",
            message: "Falha ao publicar o sermão.",
            color: "red",
          });
        }
      },
    });
  };

  const handleUnpublish = async (sermonId: string) => {
    modals.openConfirmModal({
      title: "Despublicar Sermão",
      children: (
        <Text size="sm">
          Tem certeza que deseja despublicar este sermão? <br />
          <strong>
            Ele será removido da visualização pública e poderá ser editado
            novamente.
          </strong>
        </Text>
      ),
      labels: { confirm: "Despublicar", cancel: "Cancelar" },
      confirmProps: { color: "orange" },
      onConfirm: async () => {
        try {
          await unpublishSermonMutation.mutateAsync(sermonId);
          notifications.show({
            title: "Sermão despublicado",
            message: "O sermão foi despublicado com sucesso.",
            color: "orange",
          });
        } catch (err) {
          notifications.show({
            title: "Erro",
            message: "Falha ao despublicar o sermão.",
            color: "red",
          });
        }
      },
    });
  };

  return (
    <>
      {" "}
      <Title order={1} mb={"md"} c={"violet"}>
        {"No'ah"}
      </Title>
      <Stack gap="md" mb="md">
        <Text c={isDark ? "gray.3" : "dark"}>
          Bem-vindo(a) de volta! Aqui está seu resumo.
        </Text>

        <Group gap="xs" justify="flex-end" wrap="wrap">
          <Button
            color="violet"
            variant="light"
            size="sm"
            radius="md"
            component={Link}
            href={"/dashboard/encontros"}
            leftSection={<IconCalendarEvent size={16} />}
            visibleFrom="sm"
          >
            Gerenciar Encontros
          </Button>

          <Button
            color="violet"
            variant="light"
            size="sm"
            radius="md"
            component={Link}
            href={"/dashboard/encontros"}
            leftSection={<IconCalendarEvent size={16} />}
            hiddenFrom="sm"
          >
            Encontros
          </Button>

          <Button
            color="gray"
            variant="light"
            size="sm"
            radius="md"
            component={Link}
            href={"/dashboard/interessados-encontro"}
            leftSection={<IconUsers size={16} />}
            visibleFrom="sm"
          >
            Inscritos no Encontro
          </Button>

          <Button
            color="gray"
            variant="light"
            size="sm"
            radius="md"
            component={Link}
            href={"/dashboard/interessados-encontro"}
            leftSection={<IconUsers size={16} />}
            hiddenFrom="sm"
          >
            Inscritos
          </Button>

          <Button
            color="gray"
            variant="light"
            size="sm"
            radius="md"
            component={Link}
            href={"/dashboard/sermons/add"}
            leftSection={<IconCirclePlus size={16} />}
          >
            Novo Sermão
          </Button>
        </Group>
      </Stack>
      {/* Mostrar erro se houver */}
      {error && (
        <>
          <Title mt={"md"} order={1} c={"violet"}>
            Últimos Sermões
          </Title>
          <Notification
            withCloseButton={false}
            title="Erro ao carregar sermões"
            color="red"
          >
            Não foi possível carregar os sermões. Verifique sua conexão com a
            internet.
            <br />
            <Text size="xs" c="red.7" mt="xs">
              Erro:{" "}
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </Text>
          </Notification>
        </>
      )}
      {/* Mostrar sermões se não há erro e não está carregando */}
      {!isLoading && !error && (
        <>
          <StatsGrid
            sermons={allSermons}
            encontroInscricoes={encontroInscricoes}
            activeEncounter={activeEncounter}
          />
          <Title mt={"md"} order={1} c={"violet"}>
            Últimos Sermões
          </Title>
          {allSermons.length > 0 ? (
            allSermons.map((sermon: Sermon) => (
              <LastSermons
                key={sermon.id}
                id={sermon.id}
                title={sermon.title}
                speaker={sermon.speaker}
                date={sermon.date}
                eventType={sermon.eventType}
                onRemove={() => openConfirmModal(sermon.id)}
                onpublish={() => {
                  handlePublish(sermon.id);
                }}
                onUnpublish={() => {
                  handleUnpublish(sermon.id);
                }}
                isPublished={!!sermon.publishedAt}
                isPending={
                  publishSermonMutation.isPending ||
                  unpublishSermonMutation.isPending
                }
              />
            ))
          ) : (
            <Notification
              withCloseButton={false}
              title="Nenhum sermão encontrado"
              color="violet"
            >
              Assim que você adicionar um novo sermão, ele aparecerá aqui.
            </Notification>
          )}
        </>
      )}
    </>
  );
}
