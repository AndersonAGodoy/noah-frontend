import { Group, Paper, SimpleGrid, Text, Title, Badge } from "@mantine/core";
import { useMemo, memo } from "react";

import formatRelativeDate, { formatDate } from "../lib/utils/formatDate";
import { Sermon } from "../lib/types/Sermon";

interface StatsGridProps {
  sermons: Sermon[];
  encontroInscricoes?: number; // Número de inscrições
  activeEncounter?: {
    title: string;
    startDate: Date | { toDate(): Date };
  } | null; // Informações do encontro ativo
}

const StatsGrid = memo(function StatsGrid({
  sermons,
  encontroInscricoes = 0,
  activeEncounter = null,
}: StatsGridProps) {
  const sum = useMemo(() => sermons.length, [sermons]);
  const lastupdate = sermons[0]?.createdAt;
  const lastSermon = sermons[0]?.date;
  const lastSermonFormattedDate = formatDate(lastSermon || "");

  const parsedData = useMemo(() => {
    if (!lastupdate) return null;
    const dateStr =
      typeof lastupdate === "string"
        ? lastupdate
        : lastupdate instanceof Date
        ? lastupdate.toISOString()
        : lastupdate?.toDate?.().toISOString();
    return formatRelativeDate(dateStr);
  }, [lastupdate]);
  const formattedDate = parsedData ? parsedData : "Sem data disponível";

  const formatEncounterDate = (date: Date | { toDate(): Date } | undefined) => {
    if (!date) return "Data não definida";
    const dateObj = date instanceof Date ? date : date.toDate();
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <SimpleGrid cols={{ base: 1, xs: 1, md: 4 }}>
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
            Encontro Ativo
          </Title>
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          {activeEncounter ? (
            <div>
              <Text fw={"bold"} fz={18} lineClamp={2}>
                {activeEncounter.title}
              </Text>
              <Badge color="green" size="sm" mt={4}>
                {formatEncounterDate(activeEncounter.startDate)}
              </Badge>
            </div>
          ) : (
            <Text fw={"bold"} fz={24} c="dimmed">
              Nenhum ativo
            </Text>
          )}
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          {activeEncounter ? "Próximo encontro" : "Configure um encontro"}
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
          {`${
            encontroInscricoes <= 1
              ? "Pessoa interessada"
              : "Pessoas interessadas"
          }`}
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
            ? `Útlima publicação foi em ${lastSermonFormattedDate}`
            : "Você não possui publicações"}
        </Text>
      </Paper>
    </SimpleGrid>
  );
});

export default StatsGrid;
