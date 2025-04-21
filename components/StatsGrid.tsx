import { Group, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { useMemo } from "react";
import { Sermon } from "../lib/hooks/useSermons";
import classes from "./StatsGrid.module.css";
import formatRelativeDate from "../lib/utils/formatDate";

export default function StatsGrid({ sermons }: { sermons: Sermon[] }) {
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
          <Text className={classes.value}>{sum}</Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Publicados na biblioteca
        </Text>
      </Paper>
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between">
          <Title order={2} c={"violet"}>
            Última atualização
          </Title>
        </Group>

        <Group align="flex-end" gap="xs" mt={25} tt={"capitalize"}>
          <Text className={classes.value}>{formattedDate}</Text>
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
