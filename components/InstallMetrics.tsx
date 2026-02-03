"use client";

import { useEffect, useState } from "react";
import {
  Paper,
  Text,
  Group,
  RingProgress,
  Stack,
  LoadingOverlay,
  SimpleGrid,
  ThemeIcon,
} from "@mantine/core";
import {
  IconDeviceMobile,
  IconUsers,
  IconTrendingUp,
  IconCalendar,
} from "@tabler/icons-react";
import { getInstallMetrics } from "../lib/firebase/services/fcmTokensService";
import { InstallMetrics as IInstallMetrics } from "../lib/types/FCMToken";

export function InstallMetrics() {
  const [metrics, setMetrics] = useState<IInstallMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await getInstallMetrics();
        setMetrics(data);
      } catch (error) {
        // console.error("Error fetching install metrics:", error);
        // Mesmo com erro, mostrar UI com valores zero
        setMetrics({
          totalInstalls: 0,
          activeInstalls: 0,
          lastUpdated: new Date(),
          installsByMonth: {},
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Paper p="xl" shadow="sm" radius="md" pos="relative" mih={200}>
        <LoadingOverlay visible />
      </Paper>
    );
  }

  if (!metrics) {
    return (
      <Paper p="xl" shadow="sm" radius="md">
        <Text>Sem dados de instalação disponíveis</Text>
      </Paper>
    );
  }

  const activePercentage =
    metrics.totalInstalls > 0
      ? (metrics.activeInstalls / metrics.totalInstalls) * 100
      : 0;

  return (
    <Paper p="xl" shadow="sm" radius="md">
      <Group mb="lg">
        <ThemeIcon size="xl" variant="light" color="violet">
          <IconDeviceMobile size={24} />
        </ThemeIcon>
        <div>
          <Text size="lg" fw={700}>
            Métricas de Instalação PWA
          </Text>
          <Text size="xs" c="dimmed">
            Acompanhe as instalações do app
          </Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
        <Paper p="md" withBorder>
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color="blue">
              <IconUsers size={16} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Total de Instalações
            </Text>
          </Group>
          <Text size="xl" fw={700}>
            {metrics.totalInstalls}
          </Text>
        </Paper>

        <Paper p="md" withBorder>
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color="green">
              <IconDeviceMobile size={16} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Instalações Ativas
            </Text>
          </Group>
          <Text size="xl" fw={700} c="green">
            {metrics.activeInstalls}
          </Text>
        </Paper>

        <Paper p="md" withBorder>
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color="violet">
              <IconTrendingUp size={16} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Taxa de Atividade
            </Text>
          </Group>
          <Text size="xl" fw={700}>
            {activePercentage.toFixed(0)}%
          </Text>
        </Paper>

        <Paper
          p="md"
          withBorder
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RingProgress
            size={80}
            thickness={8}
            roundCaps
            sections={[{ value: activePercentage, color: "violet" }]}
            label={
              <Text ta="center" fw={700} size="sm">
                {activePercentage.toFixed(0)}%
              </Text>
            }
          />
        </Paper>
      </SimpleGrid>

      <Stack gap="xs">
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="gray">
            <IconCalendar size={16} />
          </ThemeIcon>
          <Text size="sm" fw={600}>
            Instalações por Mês
          </Text>
        </Group>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="xs">
          {Object.entries(metrics.installsByMonth)
            .sort(([a], [b]) => b.localeCompare(a))
            .slice(0, 6)
            .map(([month, count]) => (
              <Paper key={month} p="xs" withBorder>
                <Text size="xs" c="dimmed">
                  {month}
                </Text>
                <Text size="sm" fw={600}>
                  {count}
                </Text>
              </Paper>
            ))}
        </SimpleGrid>
      </Stack>

      <Text size="xs" c="dimmed" mt="md" ta="right">
        Última atualização: {metrics.lastUpdated.toLocaleString("pt-BR")}
      </Text>
    </Paper>
  );
}
