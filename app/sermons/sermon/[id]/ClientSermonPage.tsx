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
  Progress,
  Breadcrumbs,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconArrowLeft,
  IconHome,
  IconShare,
  IconChevronRight,
  IconBook,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useClientColorScheme } from "../../../../lib/hooks/useClientColorScheme";
import { Sermon } from "../../../../lib/types/Sermon";
import { formatDate } from "../../../../lib/utils/formatDate";
import { badgeColor } from "../../../../lib/utils/badgeColor";
import MarkdownViewer from "../../../../components/MarkdownViewer";
import ThemeToggle from "../../../../components/ThemeToggle";

import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1200px)");
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);

  // Calcular tempo estimado de leitura
  useEffect(() => {
    if (sermon.markdownContent) {
      const words = sermon.markdownContent.split(/\s+/).length;
      const readTime = Math.ceil(words / 200); // 200 palavras por minuto
      setEstimatedReadTime(readTime);
    }
  }, [sermon.markdownContent]);

  // Progress bar da leitura
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {/* Estilos CSS inline para animações */}
      <style jsx global>{`
        .metadata-card:hover {
          transform: translateY(-2px);
          box-shadow: ${isDark
            ? "0 12px 40px rgba(0, 0, 0, 0.4) !important"
            : "0 12px 40px rgba(0, 0, 0, 0.15) !important"};
        }
      `}</style>

      {/* Progress Bar fixo */}
      <Progress
        value={readingProgress}
        size="xs"
        color="violet"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderRadius: 0,
        }}
      />

      {/* Header simples e elegante */}
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
        {/* Breadcrumbs abaixo do header */}
        <Box mb="2rem">
          <Breadcrumbs
            separator={
              <IconChevronRight
                size={16}
                color={isDark ? "#9775fa" : "#7950f2"}
              />
            }
            separatorMargin="xs"
          >
            <Anchor
              onClick={() => router.push("/")}
              style={{
                color: isDark ? "#c1c2c5" : "#495057",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Início
            </Anchor>
            <Anchor
              onClick={() => router.push("/#sermons")}
              style={{
                color: isDark ? "#c1c2c5" : "#495057",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Sermões
            </Anchor>
            <Text
              size="sm"
              c={isDark ? "violet.4" : "violet.7"}
              fw={600}
              style={{ fontSize: "0.875rem" }}
            >
              {sermon.title.length > 30
                ? `${sermon.title.substring(0, 30)}...`
                : sermon.title}
            </Text>
          </Breadcrumbs>
        </Box>

        <Stack gap="2rem">
          {/* Hero Section Premium */}
          <Box>
            <Stack gap="lg" mb="xl">
              {/* Badge e tempo de leitura */}
              <Group justify="space-between" align="flex-start">
                <Group gap="md">
                  <Badge
                    color={badgeColor(sermon.eventType)}
                    variant="gradient"
                    size="lg"
                    radius="md"
                    style={{
                      textTransform: "uppercase",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                    gradient={{
                      from: badgeColor(sermon.eventType) + ".6",
                      to: badgeColor(sermon.eventType) + ".8",
                    }}
                  >
                    {sermon.eventType}
                  </Badge>
                  <Badge
                    variant="light"
                    color="gray"
                    size="md"
                    radius="md"
                    leftSection={<IconBook size={14} />}
                    style={{ fontWeight: 500 }}
                  >
                    {estimatedReadTime} min de leitura
                  </Badge>
                </Group>
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
                  size={isMobile ? "lg" : "xl"}
                  c={isDark ? "gray.3" : "gray.7"}
                  lh={1.7}
                  maw={900}
                  fw={400}
                  style={{
                    fontSize: isMobile ? "1.125rem" : "1.25rem",
                    textWrap: "pretty",
                  }}
                >
                  {sermon.description}
                </Text>
              )}
            </Stack>

            {/* Metadados premium */}
            <Box
              mb="3rem"
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              <Paper
                p="lg"
                radius="xl"
                bg={isDark ? "dark.6" : "white"}
                style={{
                  border: `1px solid ${isDark ? "#373A40" : "#e9ecef"}`,
                  boxShadow: isDark
                    ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                    : "0 8px 32px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                }}
                className="metadata-card"
              >
                <Group gap="md">
                  <Avatar
                    color="violet"
                    radius="xl"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: "violet.6", to: "violet.8" }}
                  >
                    <IconUser size={24} />
                  </Avatar>
                  <Stack gap={2}>
                    <Text
                      size="xs"
                      c={isDark ? "gray.5" : "gray.6"}
                      fw={500}
                      tt="uppercase"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Pregador
                    </Text>
                    <Text size="md" fw={700} c={isDark ? "gray.1" : "gray.8"}>
                      {sermon.speaker}
                    </Text>
                  </Stack>
                </Group>
              </Paper>

              <Paper
                p="lg"
                radius="xl"
                bg={isDark ? "dark.6" : "white"}
                style={{
                  border: `1px solid ${isDark ? "#373A40" : "#e9ecef"}`,
                  boxShadow: isDark
                    ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                    : "0 8px 32px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                }}
                className="metadata-card"
              >
                <Group gap="md">
                  <Avatar
                    color="blue"
                    radius="xl"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: "blue.6", to: "cyan.6" }}
                  >
                    <IconCalendar size={24} />
                  </Avatar>
                  <Stack gap={2}>
                    <Text
                      size="xs"
                      c={isDark ? "gray.5" : "gray.6"}
                      fw={500}
                      tt="uppercase"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Data
                    </Text>
                    <Text size="md" fw={700} c={isDark ? "gray.1" : "gray.8"}>
                      {formatDate(sermon.date)}
                    </Text>
                  </Stack>
                </Group>
              </Paper>

              {sermon.duration && (
                <Paper
                  p="lg"
                  radius="xl"
                  bg={isDark ? "dark.6" : "white"}
                  style={{
                    border: `1px solid ${isDark ? "#373A40" : "#e9ecef"}`,
                    boxShadow: isDark
                      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                      : "0 8px 32px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                  }}
                  className="metadata-card"
                >
                  <Group gap="md">
                    <Avatar
                      color="green"
                      radius="xl"
                      size="lg"
                      variant="gradient"
                      gradient={{ from: "green.6", to: "teal.6" }}
                    >
                      <IconClock size={24} />
                    </Avatar>
                    <Stack gap={2}>
                      <Text
                        size="xs"
                        c={isDark ? "gray.5" : "gray.6"}
                        fw={500}
                        tt="uppercase"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        Duração
                      </Text>
                      <Text size="md" fw={700} c={isDark ? "gray.1" : "gray.8"}>
                        {sermon.duration}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              )}
            </Box>
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

          {/* Conteúdo do Sermão */}
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
                  }}
                />

                <Paper
                  p={0}
                  radius="xl"
                  bg="transparent"
                  style={{
                    maxWidth: "100%",
                  }}
                >
                  <Box
                    p={isMobile ? "2rem" : "3rem"}
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
                        borderLeft: `4px solid ${
                          isDark ? "#7950f2" : "#5f3dc4"
                        }`,
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
                        borderTop: `1px solid ${
                          isDark ? "#373A40" : "#e9ecef"
                        }`,
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
                  w={isMobile ? "100%" : undefined}
                  onClick={handleShare}
                >
                  Compartilhar
                </Button>
                <Button
                  leftSection={<IconHome size={18} />}
                  variant="light"
                  color="cyan"
                  size="md"
                  w={isMobile ? "100%" : undefined}
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
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
