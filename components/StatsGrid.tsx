import { Group, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { useMemo } from "react";

import classes from "./StatsGrid.module.css";
import formatRelativeDate from "../lib/utils/formatDate";
import { Sermon } from "../lib/types/Sermon";

interface StatsGridProps {
  sermons: Sermon[];
  encontroInscricoes?: number; // Novo prop para inscrições
}

export default function StatsGrid({
  sermons,
  encontroInscricoes = 0,
}: StatsGridProps) {
  const sum = useMemo(() => sermons.length, [sermons]);
  const lastupdate = sermons[0]?.createdAt;
  const lastSermon = sermons[0]?.date;

  const parsedData = useMemo(
    () => formatRelativeDate(lastupdate),
    [lastupdate]
  );
  const formattedDate = parsedData ? parsedData : "Sem data disponível";
  return (
    <SimpleGrid cols={{ base: 1, xs: 1, md: 3 }}>
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between">
          <Title order={2} c={"violet"}>
            Total de Sermões
          </Title>
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text fw={"bold"} fz={30}>
            {sum}
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Publicados na biblioteca
        </Text>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Group justify="space-between">
          <Title order={2} c={"violet"}>
            Inscrições Encontro
          </Title>
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text fw={"bold"} fz={30}>
            {encontroInscricoes}
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Pessoas interessadas
        </Text>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Group justify="space-between">
          <Title order={2} c={"violet"}>
            Última atualização
          </Title>
        </Group>

        <Group align="flex-end" gap="xs" mt={25} tt={"capitalize"}>
          <Text fw={"bold"} fz={30}>
            {formattedDate}
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          {lastSermon
            ? `Útlima publicação foi em ${lastSermon}`
            : "Você não possui publicações"}
        </Text>
      </Paper>
    </SimpleGrid>
  );
}
