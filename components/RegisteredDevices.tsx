"use client";

import {
  Paper,
  Text,
  Table,
  Badge,
  Group,
  Stack,
  LoadingOverlay,
  ThemeIcon,
  ScrollArea,
  ActionIcon,
  Tooltip,
  Pagination,
} from "@mantine/core";
import {
  IconDeviceMobile,
  IconDeviceDesktop,
  IconBrandApple,
  IconBrandAndroid,
  IconBrandWindows,
  IconBrandChrome,
  IconRefresh,
} from "@tabler/icons-react";
import { useGetAllFCMTokens } from "../lib/hooks/useGetAllFCMTokens";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

function getDeviceIcon(userAgent: string | undefined) {
  const ua = (userAgent || "").toLowerCase();

  if (ua.includes("android")) return <IconBrandAndroid size={18} />;
  if (ua.includes("iphone") || ua.includes("ipad"))
    return <IconBrandApple size={18} />;
  if (ua.includes("windows")) return <IconBrandWindows size={18} />;
  if (ua.includes("mobile")) return <IconDeviceMobile size={18} />;

  return <IconDeviceDesktop size={18} />;
}

function getDeviceName(userAgent: string | undefined): string {
  const ua = (userAgent || "").toLowerCase();

  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone")) return "iPhone";
  if (ua.includes("ipad")) return "iPad";
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac")) return "macOS";
  if (ua.includes("linux")) return "Linux";

  return "Desconhecido";
}

function getBrowser(userAgent: string | undefined): string {
  const ua = (userAgent || "").toLowerCase();

  if (ua.includes("edg")) return "Edge";
  if (ua.includes("chrome")) return "Chrome";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("safari")) return "Safari";

  return "Navegador";
}

const ITEMS_PER_PAGE = 10;

export function RegisteredDevices() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: tokens,
    isLoading,
    refetch,
    isRefetching,
  } = useGetAllFCMTokens();

  if (isLoading) {
    return (
      <Paper p="xl" shadow="sm" radius="md" pos="relative" mih={200}>
        <LoadingOverlay visible />
      </Paper>
    );
  }

  const validTokens = tokens?.filter((t) => t.isValid) || [];

  // Ordenar por último acesso (mais recente primeiro)
  const sortedTokens = [...validTokens].sort((a, b) => {
    const dateA = new Date(a.lastActive).getTime();
    const dateB = new Date(b.lastActive).getTime();
    return dateB - dateA; // Mais recente primeiro
  });

  const totalDevices = sortedTokens.length;
  const totalPages = Math.ceil(totalDevices / ITEMS_PER_PAGE);

  // Paginar os tokens
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTokens = sortedTokens.slice(startIndex, endIndex);

  return (
    <Paper p="xl" shadow="sm" radius="md">
      <Group justify="space-between" mb="lg">
        <Group>
          <ThemeIcon size="xl" variant="light" color="blue">
            <IconDeviceMobile size={24} />
          </ThemeIcon>
          <div>
            <Text size="lg" fw={700}>
              Dispositivos Registrados
            </Text>
            <Text size="xs" c="dimmed">
              {totalDevices}{" "}
              {totalDevices === 1
                ? "dispositivo conectado"
                : "dispositivos conectados"}
            </Text>
          </div>
        </Group>

        <Tooltip label="Atualizar lista">
          <ActionIcon
            variant="light"
            color="blue"
            size="lg"
            onClick={() => refetch()}
            loading={isRefetching}
          >
            <IconRefresh size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {totalDevices === 0 ? (
        <Stack align="center" py="xl">
          <IconDeviceMobile size={48} stroke={1.5} opacity={0.3} />
          <Text c="dimmed" ta="center">
            Nenhum dispositivo registrado ainda
          </Text>
        </Stack>
      ) : (
        <Stack gap="md">
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Dispositivo</Table.Th>
                  <Table.Th>Navegador</Table.Th>
                  <Table.Th>Último Acesso</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedTokens.map((token) => {
                  // Garantir que deviceInfo e userAgent existem
                  const userAgent = token?.deviceInfo?.userAgent || "Unknown";
                  const deviceName = getDeviceName(userAgent);
                  const browser = getBrowser(userAgent);
                  const lastActive = formatDistanceToNow(
                    new Date(token.lastActive),
                    { addSuffix: true, locale: ptBR },
                  );

                  return (
                    <Table.Tr key={token.id}>
                      <Table.Td>
                        <Group gap="xs">
                          <ThemeIcon variant="light" color="gray" size="sm">
                            {getDeviceIcon(userAgent)}
                          </ThemeIcon>
                          <Text size="sm" fw={500}>
                            {deviceName}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <IconBrandChrome size={16} opacity={0.6} />
                          <Text size="sm" c="dimmed">
                            {browser}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {lastActive}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={token.isValid ? "green" : "gray"}
                          variant="light"
                          size="sm"
                        >
                          {token.isValid ? "Ativo" : "Inativo"}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {totalPages > 1 && (
            <Group justify="center">
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={setCurrentPage}
                size="sm"
              />
            </Group>
          )}
        </Stack>
      )}
    </Paper>
  );
}
