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
import useSermons from "../lib/hooks/useSermons";
import { useEffect, useMemo, useRef } from "react";
import StatsGrid from "./StatsGrid";
import useDeleteSermon from "../lib/hooks/useDeleteSermon";
import { modals } from "@mantine/modals";
import { notifications, showNotification } from "@mantine/notifications";
import LastSermons from "./LastSermons";
import usePublishSermonMutation from "../lib/hooks/usePublishSermon";
import { IconCirclePlus, IconUsers } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { Sermon } from "../lib/types/Sermon";
import { useClientColorScheme } from "../lib/hooks/useClientColorScheme";

export default function DashboardPage() {
  const { data, isLoading } = useSermons();
  const searchParams = useSearchParams();
  const created = searchParams.get("created");
  const updated = searchParams.get("updated");
  const publishSermon = usePublishSermonMutation();
  const deleteSermon = useDeleteSermon();
  const { isDark } = useClientColorScheme();

  // Mock de inscrições do Encontro com Deus
  const encontroInscricoes = 15; // Número mockado de inscrições

  const allSermons = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

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
          await deleteSermon.mutateAsync(sermonId);
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
          await publishSermon.mutateAsync(sermonId);
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
      {!isLoading && (
        <>
          <StatsGrid
            sermons={allSermons}
            encontroInscricoes={encontroInscricoes}
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
                isPublished={sermon.published}
                isPending={publishSermon.isPending}
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
