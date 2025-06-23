"use client";

import {
  Button,
  Container,
  SimpleGrid,
  Stack,
  Title,
  Text,
  Select,
  Box,
  Paper,
  Group,
  Divider,
  Badge,
  Anchor,
  Grid,
  UnstyledButton,
} from "@mantine/core";
import {
  IconFilter,
  IconBuildingChurch,
  IconMapPin,
  IconBrandInstagram,
  IconBrandSpotify,
  IconBrandYoutube,
  IconClipboardTextFilled,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import useSermons from "../lib/hooks/useSermons";
import SermonCard from "../components/SermonCard";
import SermonCardSkeleton from "../components/SermonCardSkeleton";
import EncontroComDeusModal from "../components/EncontroComDeusModal";
import ThemeToggle from "../components/ThemeToggle";
import { useState, useEffect } from "react";
import { useClientColorScheme } from "../lib/hooks/useClientColorScheme";

export default function HomePage() {
  const [eventType, setEventType] = useState<string>("");
  const [modalOpened, setModalOpened] = useState(false);
  const { isDark, mounted } = useClientColorScheme();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSermons({
    limit: 10,
    eventType: eventType,
  });

  const sermons =
    data?.pages.flatMap((page) => page.items.filter((s) => s.published)) || [];
  return (
    <Box bg={isDark ? "dark.8" : "gray.0"} mih="100vh">
      {/* Header */}
      <Box
        w="100%"
        bg="linear-gradient(135deg, var(--mantine-color-violet-8) 0%, var(--mantine-color-violet-6) 100%)"
        py="lg"
        mb={0}
        style={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Group gap="md">
              <IconBuildingChurch size={36} color="white" />
              <Title c="white" order={1} fw={800} size="h1" lh={1}>
                No'ah
              </Title>
            </Group>
            <Group gap="md" wrap="nowrap">
              <ThemeToggle color="white" />
              <UnstyledButton
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
                onClick={() => setModalOpened(true)}
              >
                <IconClipboardTextFilled size={26} color="white" />
                <Text
                  c="white"
                  size="md"
                  fw={600}
                  style={{ whiteSpace: "nowrap" }}
                  visibleFrom="sm"
                >
                  Inscrição encontro com Deus
                </Text>
              </UnstyledButton>
              <Button
                component="a"
                href="/dashboard"
                variant="gradient"
                gradient={{ from: "violet.5", to: "violet.8" }}
                radius="xl"
                c={"white"}
                size="md"
                px="2rem"
                py="sm"
                fw={600}
              >
                Login
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>{" "}
      {/* Hero Section */}
      <Box
        bg={
          isDark
            ? "linear-gradient(180deg, var(--mantine-color-dark-7) 0%, var(--mantine-color-dark-8) 100%)"
            : "linear-gradient(180deg, white 0%, var(--mantine-color-gray-0) 100%)"
        }
        py="4rem"
      >
        <Container size="xl">
          <Stack align="center" gap="xl" py="2rem">
            <Title
              ta="center"
              order={1}
              size="3rem"
              fw={800}
              c={isDark ? "white" : "dark"}
              maw={700}
              lh={1.1}
            >
              Seja Bem-vindo(a) ao{" "}
              <Text span c="violet.6" inherit>
                No'ah
              </Text>{" "}
              🙌
            </Title>
            <Text
              ta="center"
              size="xl"
              c={isDark ? "gray.4" : "gray.6"}
              maw={600}
              lh={1.7}
              fw={400}
            >
              Explore nossos sermões, devocionais e conteúdos que edificam a fé
              e transformam vidas através da palavra de Deus.
            </Text>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "violet", to: "violet.6" }}
              radius="xl"
              px="lg"
              py="sm"
              maw="95%"
              style={{
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "visible",
                lineHeight: 1.3,
              }}
              styles={{
                root: {
                  fontSize: "var(--mantine-font-size-sm)",
                  "@media (maxWidth: 768px)": {
                    fontSize: "var(--mantine-font-size-xs)",
                    paddingLeft: "var(--mantine-spacing-sm)",
                    paddingRight: "var(--mantine-spacing-sm)",
                    paddingTop: "var(--mantine-spacing-xs)",
                    paddingBottom: "var(--mantine-spacing-xs)",
                    whiteSpace: "normal",
                    wordBreak: "keep-all",
                    overflowWrap: "normal",
                    hyphens: "none",
                  },
                },
              }}
            >
              ✨ Conteúdos atualizados semanalmente
            </Badge>
          </Stack>
        </Container>
      </Box>
      <Container px="md" py="2rem" size="xl">
        {/* Filtro */}

        <Stack
          align="center"
          gap="sm"
          style={{
            "@media (maxWidth: 768px)": { gap: "md" },
            marginBottom: "2rem",
          }}
        >
          {" "}
          <Group gap="sm" wrap="wrap" justify="center">
            <IconFilter size={22} color="var(--mantine-color-violet-6)" />
            <Text fw={600} c={isDark ? "white" : "dark"} size="lg" ta="center">
              Filtrar conteúdo:
            </Text>
          </Group>
          <Select
            data={[
              { value: "", label: "Todos os conteúdos" },
              { value: "culto", label: "Cultos" },
              { value: "devocional", label: "Devocionais" },
            ]}
            value={eventType}
            onChange={(value) => setEventType(value || "")}
            size="lg"
            radius="xl"
            w={{ base: "100%", sm: 240 }}
            maw={300}
            styles={{
              input: {
                borderColor: "var(--mantine-color-violet-3)",
                borderWidth: 2,
                "&:focus": {
                  borderColor: "var(--mantine-color-violet-6)",
                  boxShadow: "0 0 0 3px var(--mantine-color-violet-1)",
                },
              },
            }}
          />
        </Stack>

        {/* Conteúdo */}
        <Box>
          {" "}
          {!isLoading && sermons.length > 0 && (
            <Group justify="space-between" align="center" mb="2rem">
              <Text c={isDark ? "gray.4" : "gray.6"} size="lg" fw={500}>
                {sermons.length}{" "}
                {sermons.length === 1
                  ? "conteúdo encontrado"
                  : "conteúdos encontrados"}
              </Text>
              <Divider
                style={{ flex: 1 }}
                ml="lg"
                color={isDark ? "dark.4" : "gray.3"}
              />
            </Group>
          )}
          {isLoading && (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="2rem">
              {[...Array(6)].map((_, i) => (
                <SermonCardSkeleton key={i} />
              ))}
            </SimpleGrid>
          )}
          {!isLoading && sermons.length === 0 && (
            <Paper
              shadow="md"
              p="3rem"
              radius="xl"
              mb="2rem"
              bg={isDark ? "dark.6" : "white"}
              style={{
                border: `1px solid ${
                  isDark
                    ? "var(--mantine-color-dark-4)"
                    : "var(--mantine-color-gray-2)"
                }`,
              }}
            >
              <Stack align="center" gap="lg">
                <IconBuildingChurch
                  size={64}
                  color={
                    isDark
                      ? "var(--mantine-color-gray-6)"
                      : "var(--mantine-color-gray-4)"
                  }
                />
                <Title
                  order={2}
                  c={isDark ? "gray.3" : "gray.6"}
                  fw={600}
                  ta="center"
                >
                  Nenhum conteúdo encontrado
                </Title>
                <Text
                  c={isDark ? "gray.5" : "gray.5"}
                  size="lg"
                  maw={400}
                  ta="center"
                  lh={1.6}
                >
                  {eventType
                    ? `Não há conteúdos de "${eventType}" publicados no momento.`
                    : "Não há conteúdos publicados no momento."}{" "}
                  Volte em breve para conferir novos sermões e devocionais!
                </Text>
              </Stack>
            </Paper>
          )}
          {!isLoading && sermons.length > 0 && (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="2rem">
              {sermons.map((sermon) => (
                <SermonCard
                  key={sermon.id}
                  slug={sermon.id}
                  description={sermon.description}
                  eventType={sermon.eventType}
                  title={sermon.title}
                  speaker={sermon.speaker}
                  date={sermon.date}
                  duration={sermon.duration}
                />
              ))}
            </SimpleGrid>
          )}{" "}
          {isError && (
            <Paper
              p="3rem"
              radius="xl"
              bg={isDark ? "red.9" : "red.0"}
              ta="center"
              shadow="sm"
            >
              <Stack align="center" gap="lg">
                <Title order={2} c="red.6" fw={600}>
                  Erro ao carregar conteúdos
                </Title>
                <Text c={isDark ? "red.4" : "red.7"} size="lg" maw={400}>
                  Ocorreu um erro ao carregar os sermões. Tente novamente mais
                  tarde.
                </Text>
              </Stack>
            </Paper>
          )}
          {hasNextPage && (
            <Group justify="center" mt="3rem">
              <Button
                size="xl"
                variant="gradient"
                gradient={{ from: "violet.6", to: "violet.8" }}
                loading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
                radius="xl"
                px="2rem"
                py="sm"
                fw={600}
                styles={{
                  root: {
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)",
                    },
                  },
                }}
              >
                Carregar mais conteúdos
              </Button>
            </Group>
          )}
        </Box>
      </Container>
      {/* Rodapé */}
      <Box
        component="footer"
        bg="linear-gradient(135deg, var(--mantine-color-violet-9) 0%, var(--mantine-color-violet-8) 100%)"
        py="3rem"
        mt="3rem"
      >
        <Container size="xl">
          <Grid>
            {/* Redes Sociais */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                <Title order={4} c="white" fw={600}>
                  Acompanhe nossas redes sociais:
                </Title>

                <Stack gap="md">
                  <Group gap="sm">
                    <IconBrandInstagram size={20} color="white" />
                    <Anchor
                      href="https://instagram.com/igrejanoah.guapituba"
                      target="_blank"
                      c="white"
                      size="sm"
                      fw={500}
                    >
                      igrejanoah.guapituba
                    </Anchor>
                  </Group>

                  <Group gap="sm">
                    <IconBrandSpotify size={20} color="white" />
                    <Text c="white" size="sm" fw={500}>
                      Igreja No'ah
                    </Text>
                  </Group>

                  <Group gap="sm">
                    <IconBrandYoutube size={20} color="white" />
                    <Text c="white" size="sm" fw={500}>
                      No'ah Guapituba
                    </Text>
                  </Group>

                  <Group gap="sm">
                    <IconBrandWhatsapp size={20} color="white" />
                    <Anchor
                      href="https://wa.me/5511917307638"
                      target="_blank"
                      c="white"
                      size="sm"
                      fw={500}
                    >
                      (11) 91730-7638
                    </Anchor>
                  </Group>

                  <Group gap="sm">
                    <IconBrandInstagram size={20} color="white" />
                    <Anchor
                      href="https://instagram.com/brunosimoes02"
                      target="_blank"
                      c="white"
                      size="sm"
                      fw={500}
                    >
                      brunosimoes02
                    </Anchor>
                  </Group>
                </Stack>
              </Stack>
            </Grid.Col>

            {/* Contribuições */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                <Title order={4} c="white" fw={600}>
                  Contribua com essa obra:
                </Title>

                <Stack gap="md">
                  <Text c="violet.2" size="sm" fw={500}>
                    utilizando a chave PIX:
                  </Text>

                  <Paper bg="violet.6" p="sm" radius="md">
                    <Text c="white" ta="center" fw={600} ff="monospace">
                      (11) 91730-7638
                    </Text>
                  </Paper>
                </Stack>
              </Stack>
            </Grid.Col>
          </Grid>

          <Divider my="xl" color="violet.7" />

          <Stack align="center" gap="md">
            <Group gap="xs" wrap="wrap" justify="center">
              <IconMapPin size={18} color="white" />
              <Text
                c="white"
                size="sm"
                fw={500}
                ta="center"
                style={{
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  lineHeight: 1.4,
                }}
                styles={{
                  root: {
                    "@media (maxWidth: 768px)": {
                      fontSize: "var(--mantine-font-size-xs)",
                      lineHeight: 1.3,
                    },
                  },
                }}
              >
                R. Cícero de Campos Póvoa, 42 - Guapituba, Mauá - SP
              </Text>
            </Group>
            <Text c="violet.2" ta="center" size="xs">
              © 2025 Igreja No'ah. Todos os direitos reservados.
            </Text>{" "}
          </Stack>
        </Container>
      </Box>
      {/* Modal do Encontro com Deus */}
      <EncontroComDeusModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </Box>
  );
}
