"use client";

import {
  Button,
  Container,
  SimpleGrid,
  Stack,
  Title,
  Text,
  Flex,
  Select,
  Box,
  Paper,
  Group,
  Divider,
  Badge,
  Anchor,
  Image,
  Grid,
} from "@mantine/core";
import { IconFilter, IconBuildingChurch, IconMapPin, IconPhone, IconMail, IconBrandInstagram, IconBrandSpotify, IconBrandYoutube, IconBrandWhatsapp } from "@tabler/icons-react";
import useSermons from "../lib/hooks/useSermons";
import SermonCard from "../components/SermonCard";
import SermonCardSkeleton from "../components/SermonCardSkeleton";
import { useState } from "react";

export default function HomePage() {
  const [eventType, setEventType] = useState<string>("");
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
    <Box bg="gray.0" mih="100vh">
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
          </Group>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        bg="linear-gradient(180deg, white 0%, var(--mantine-color-gray-0) 100%)"
        py="4rem"
      >
        <Container size="xl">
          <Stack align="center" gap="xl" py="2rem">
            <Title
              ta="center"
              order={1}
              size="3rem"
              fw={800}
              c="dark"
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
              c="gray.6"
              maw={600}
              lh={1.7}
              fw={400}
            >
              Explore nossos sermões, devocionais e conteúdos que edificam a fé e transformam vidas através da palavra de Deus.
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
        <Paper
          shadow="lg"
          p="xl"
          radius="xl"
          mb="2rem"
          bg="white"
          style={{
            border: "1px solid var(--mantine-color-gray-2)",
          }}
        >
          <Group justify="center" align="center" gap="xl">
            <Group gap="sm">
              <IconFilter size={22} color="var(--mantine-color-violet-6)" />
              <Text fw={600} c="dark" size="lg">
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
              w={240}
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
          </Group>
        </Paper>

        {/* Conteúdo */}
        <Box>
          {!isLoading && sermons.length > 0 && (
            <Group justify="space-between" align="center" mb="2rem">
              <Text c="gray.6" size="lg" fw={500}>
                {sermons.length} {sermons.length === 1 ? "conteúdo encontrado" : "conteúdos encontrados"}
              </Text>
              <Divider style={{ flex: 1 }} ml="lg" color="gray.3" />
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
            <Paper p="3rem" radius="xl" bg="gray.50" ta="center" shadow="sm">
              <Stack align="center" gap="lg">
                <IconBuildingChurch size={64} color="var(--mantine-color-gray-4)" />
                <Title order={2} c="gray.6" fw={600}>
                  Nenhum conteúdo encontrado
                </Title>
                <Text c="gray.5" size="lg" maw={400}>
                  Não há conteúdos publicados no momento. Volte em breve para conferir novos sermões e devocionais!
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
          )}

          {isError && (
            <Paper p="3rem" radius="xl" bg="red.0" ta="center" shadow="sm">
              <Stack align="center" gap="lg">
                <Title order={2} c="red.6" fw={600}>
                  Erro ao carregar conteúdos
                </Title>
                <Text c="red.7" size="lg" maw={400}>
                  Ocorreu um erro ao carregar os sermões. Tente novamente mais tarde.
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
            </Text>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
