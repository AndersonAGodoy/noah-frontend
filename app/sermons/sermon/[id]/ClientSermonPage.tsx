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
  Anchor,
  Avatar,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconArrowLeft,
  IconHome,
  IconShare,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useClientColorScheme } from "../../../../lib/hooks/useClientColorScheme";
import { Sermon } from "../../../../lib/types/Sermon";
import { formatDate } from "../../../../lib/utils/formatDate";
import { badgeColor } from "../../../../lib/utils/badgeColor";
import MarkdownViewer from "../../../../components/MarkdownViewer";
import ThemeToggle from "../../../../components/ThemeToggle";

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon.title,
          text: sermon.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      // Fallback: copiar link
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado!");
    }
  };

  return (
    <Box bg={isDark ? "dark.8" : "gray.0"} mih="100vh">
      {/* Header com gradiente */}
      <Box
        style={{
          background: isDark
            ? "linear-gradient(135deg, #7950f2 0%, #6741d9 100%)"
            : "linear-gradient(135deg, #7950f2 0%, #5f3dc4 100%)",
          borderBottom: `1px solid ${isDark ? "#373A40" : "#e9ecef"}`,
        }}
      >
        <Container size="lg" py="lg">
          <Group justify="space-between" align="center">
            <Button
              leftSection={<IconArrowLeft size={18} />}
              variant="white"
              color="violet"
              size="sm"
              onClick={() => router.push("/")}
            >
              Voltar
            </Button>
            <Group gap="sm">
            <ThemeToggle />
            <Button
              leftSection={<IconShare size={18} />}
              variant="light"
              color="white"
              size="sm"
              onClick={handleShare}
              style={{ color: "white" }}
            >
              Compartilhar
            </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      <Container size="lg" py="3rem">
        <Stack gap="2rem">
          {/* Hero Section do Sermão */}
          <Box>
            <Stack gap="md" mb="xl">
              <Group gap="sm">
                <Badge
                  color={badgeColor(sermon.eventType)}
                  variant="light"
                  size="lg"
                  radius="md"
                  style={{ textTransform: "uppercase", fontWeight: 600 }}
                >
                  {sermon.eventType}
                </Badge>
              </Group>

              <Title
                order={1}
                size="3rem"
                fw={800}
                c={isDark ? "gray.0" : "gray.9"}
                lh={1.1}
                style={{
                  letterSpacing: "-0.02em",
                }}
              >
                {sermon.title}
              </Title>

              {sermon.description && (
                <Text
                  size="xl"
                  c={isDark ? "gray.4" : "gray.6"}
                  lh={1.6}
                  maw={800}
                  fw={400}
                >
                  {sermon.description}
                </Text>
              )}
            </Stack>

            {/* Metadados com cards */}
            <Group gap="lg" mb="2rem">
              <Paper
                p="md"
                radius="md"
                bg={isDark ? "dark.6" : "white"}
                style={{
                  border: `1px solid ${isDark ? "#373A40" : "#e9ecef"}`,
                  flex: 1,
                }}
              >
                <Group gap="sm">
                  <Avatar color="violet" radius="xl" size="md">
                    <IconUser size={20} />
                  </Avatar>
                  <Stack gap={0}>
                    <Text size="xs" c={isDark ? "gray.5" : "gray.6"} fw={500}>
                      Pregador
                    </Text>
                    <Text size="sm" fw={600} c={isDark ? "gray.1" : "gray.8"}>
                      {sermon.speaker}
                    </Text>
                  </Stack>
                </Group>
              </Paper>

              <Paper
                p="md"
                radius="md"
                bg={isDark ? "dark.6" : "white"}
                style={{
                  border: `1px solid ${isDark ? "#373A40" : "#e9ecef"}`,
                  flex: 1,
                }}
              >
                <Group gap="sm">
                  <Avatar color="violet" radius="xl" size="md">
                    <IconCalendar size={20} />
                  </Avatar>
                  <Stack gap={0}>
                    <Text size="xs" c={isDark ? "gray.5" : "gray.6"} fw={500}>
                      Data
                    </Text>
                    <Text size="sm" fw={600} c={isDark ? "gray.1" : "gray.8"}>
                      {formatDate(sermon.date)}
                    </Text>
                  </Stack>
                </Group>
              </Paper>

              {sermon.duration && (
                <Paper
                  p="md"
                  radius="md"
                  bg={isDark ? "dark.6" : "white"}
                  style={{
                    border: `1px solid ${isDark ? "#373A40" : "#e9ecef"}`,
                    flex: 1,
                  }}
                >
                  <Group gap="sm">
                    <Avatar color="violet" radius="xl" size="md">
                      <IconClock size={20} />
                    </Avatar>
                    <Stack gap={0}>
                      <Text
                        size="xs"
                        c={isDark ? "gray.5" : "gray.6"}
                        fw={500}
                      >
                        Duração
                      </Text>
                      <Text
                        size="sm"
                        fw={600}
                        c={isDark ? "gray.1" : "gray.8"}
                      >
                        {sermon.duration}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              )}
            </Group>
          </Box>

          <Divider
            my="xl"
            size="md"
            variant="dashed"
            label={
              <Group gap="xs">
                <Box
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: isDark ? "#7950f2" : "#5f3dc4",
                  }}
                />
                <Text
                  size="sm"
                  fw={700}
                  c={isDark ? "violet.4" : "violet.7"}
                  tt="uppercase"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Conteúdo do Sermão
                </Text>
                <Box
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: isDark ? "#7950f2" : "#5f3dc4",
                  }}
                />
              </Group>
            }
            labelPosition="center"
          />

          {/* Conteúdo do Sermão - Estilo revista/blog moderno */}
          {sermon.markdownContent && (
            <Box>
              {/* Decoração superior */}
              <Box
                mb="xl"
                style={{
                  height: 4,
                  width: 80,
                  background: isDark
                    ? "linear-gradient(90deg, #7950f2 0%, #5f3dc4 100%)"
                    : "linear-gradient(90deg, #7950f2 0%, #5f3dc4 100%)",
                  borderRadius: 2,
                  margin: "0 auto",
                }}
              />

              <Paper
                p={0}
                radius="xl"
                bg="transparent"
                style={{
                  maxWidth: "900px",
                  margin: "0 auto",
                }}
              >
                <Box
                  p="3rem"
                  style={{
                    background: isDark ? "#25262b" : "#ffffff",
                    borderRadius: "16px",
                    border: `1px solid ${isDark ? "#373A40" : "#e9ecef"}`,
                    boxShadow: isDark
                      ? "0 10px 40px rgba(0, 0, 0, 0.4)"
                      : "0 10px 40px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  {/* Letra capitular decorativa */}
                  <Box
                    mb="lg"
                    style={{
                      borderLeft: `4px solid ${isDark ? "#7950f2" : "#5f3dc4"}`,
                      paddingLeft: "1rem",
                    }}
                  >
                    <Text
                      size="sm"
                      fw={600}
                      c={isDark ? "violet.4" : "violet.7"}
                      tt="uppercase"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      📖 Leitura
                    </Text>
                  </Box>

                  {/* Conteúdo com tipografia melhorada */}
                  <Box
                    className="sermon-content"
                    style={{
                      fontSize: "1.0625rem",
                      lineHeight: 1.8,
                      color: isDark ? "#C1C2C5" : "#495057",
                    }}
                  >
                    <MarkdownViewer content={sermon.markdownContent} />
                  </Box>

                  {/* Decoração inferior */}
                  <Box
                    mt="3rem"
                    pt="2rem"
                    style={{
                      borderTop: `1px solid ${isDark ? "#373A40" : "#e9ecef"}`,
                    }}
                  >
                    <Group justify="center" gap="xs">
                      <Box
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: isDark ? "#7950f2" : "#5f3dc4",
                        }}
                      />
                      <Box
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: isDark ? "#7950f2" : "#5f3dc4",
                        }}
                      />
                      <Box
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: isDark ? "#7950f2" : "#5f3dc4",
                        }}
                      />
                    </Group>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}

          {/* Footer da página do sermão */}
          <Paper
            p="xl"
            radius="lg"
            bg={isDark ? "dark.6" : "violet.0"}
            mt="2rem"
            style={{
              border: `1px solid ${isDark ? "#373A40" : "#d0bfff"}`,
            }}
          >
            <Stack gap="md" align="center">
              <Text
                size="lg"
                fw={600}
                c={isDark ? "gray.2" : "violet.9"}
                ta="center"
              >
                Gostou deste conteúdo?
              </Text>
              <Text
                size="sm"
                c={isDark ? "gray.4" : "violet.7"}
                ta="center"
                maw={500}
              >
                Compartilhe com seus amigos e familiares para que eles também
                possam ser abençoados!
              </Text>
              <Group gap="md">
                <Button
                  leftSection={<IconShare size={18} />}
                  variant="light"
                  color="violet"
                  size="md"
                  onClick={handleShare}
                >
                  Compartilhar
                </Button>
                <Button
                  leftSection={<IconHome size={18} />}
                  variant="outline"
                  color="violet"
                  size="md"
                  onClick={() => router.push("/")}
                >
                  Ver mais sermões
                </Button>
              </Group>
            </Stack>
          </Paper>

          {/* Informação sobre cache */}
          <Text
            size="xs"
            c={isDark ? "gray.6" : "gray.5"}
            ta="center"
            fs="italic"
          >
            Última atualização:{" "}
            {new Date(lastUpdated).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
