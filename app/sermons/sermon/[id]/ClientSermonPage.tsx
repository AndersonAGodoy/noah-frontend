"use client";

import {
  Container,
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Paper,
  Box,
  Button,
  Divider,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useClientColorScheme } from "../../../../lib/hooks/useClientColorScheme";
import { Sermon } from "../../../../lib/types/Sermon";
import { formatDate } from "../../../../lib/utils/formatDate";
import { badgeColor } from "../../../../lib/utils/badgeColor";

interface ClientSermonPageProps {
  sermon: Sermon;
  lastUpdated: string;
}

export default function ClientSermonPage({
  sermon,
  lastUpdated,
}: ClientSermonPageProps) {
  const router = useRouter();
  const { isDark, mounted } = useClientColorScheme();

  if (!mounted) {
    return null;
  }

  return (
    <Box bg={isDark ? "dark.8" : "gray.0"} mih="100vh">
      <Container size="md" py="xl">
        <Stack gap="xl">
          {/* Botão Voltar */}
          <Button
            leftSection={<IconArrowLeft size={16} />}
            variant="subtle"
            onClick={() => router.push("/")}
            w="fit-content"
          >
            Voltar
          </Button>

          {/* Header do Sermão */}
          <Paper
            p="xl"
            radius="lg"
            bg={isDark ? "dark.6" : "white"}
            shadow="sm"
          >
            <Stack gap="lg">
              <Group justify="space-between" align="flex-start">
                <Stack gap="sm" flex={1}>
                  <Badge
                    color={badgeColor(sermon.eventType)}
                    variant="light"
                    size="md"
                    w="fit-content"
                  >
                    {sermon.eventType}
                  </Badge>

                  <Title
                    order={1}
                    size="h1"
                    c={isDark ? "gray.1" : "gray.8"}
                    lh={1.2}
                  >
                    {sermon.title}
                  </Title>

                  <Text size="lg" c={isDark ? "gray.4" : "gray.6"} lh={1.6}>
                    {sermon.description}
                  </Text>
                </Stack>
              </Group>

              <Divider />

              {/* Metadados */}
              <Group gap="xl">
                <Group gap="xs">
                  <IconUser size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                  <Text size="sm" c={isDark ? "gray.4" : "gray.6"}>
                    {sermon.speaker}
                  </Text>
                </Group>

                <Group gap="xs">
                  <IconCalendar
                    size={16}
                    color={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                  <Text size="sm" c={isDark ? "gray.4" : "gray.6"}>
                    {formatDate(sermon.date)}
                  </Text>
                </Group>

                {sermon.duration && (
                  <Group gap="xs">
                    <IconClock
                      size={16}
                      color={isDark ? "#9CA3AF" : "#6B7280"}
                    />
                    <Text size="sm" c={isDark ? "gray.4" : "gray.6"}>
                      {sermon.duration}
                    </Text>
                  </Group>
                )}
              </Group>
            </Stack>
          </Paper>

          {/* Conteúdo do Sermão */}
          {sermon.markdownContent && (
            <Paper
              p="xl"
              radius="lg"
              bg={isDark ? "dark.6" : "white"}
              shadow="sm"
            >
              <Box
                style={{
                  "& h1, & h2, & h3": {
                    color: isDark ? "#F8F9FA" : "#212529",
                    marginBottom: "1rem",
                  },
                  "& p": {
                    color: isDark ? "#C1C2C5" : "#343A40",
                    lineHeight: 1.6,
                    marginBottom: "1rem",
                  },
                  "& code": {
                    backgroundColor: isDark ? "#2C2E33" : "#F8F9FA",
                    color: isDark ? "#C1C2C5" : "#495057",
                    padding: "2px 4px",
                    borderRadius: "4px",
                  },
                  "& blockquote": {
                    borderLeft: `4px solid ${isDark ? "#495057" : "#DEE2E6"}`,
                    backgroundColor: isDark ? "#25262B" : "#F8F9FA",
                    padding: "1rem",
                    margin: "1rem 0",
                    borderRadius: "4px",
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: sermon.markdownContent
                    .replace(/\n/g, "<br>")
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(/`(.*?)`/g, "<code>$1</code>")
                    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
                    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
                    .replace(/^# (.*?)$/gm, "<h1>$1</h1>"),
                }}
              />
            </Paper>
          )}

          {/* Informação sobre cache */}
          <Text
            size="xs"
            c={isDark ? "gray.6" : "gray.5"}
            ta="center"
            fs="italic"
          >
            Última atualização:{" "}
            {new Date(lastUpdated).toLocaleDateString("pt-BR")}
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
