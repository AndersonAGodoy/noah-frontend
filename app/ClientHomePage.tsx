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
  IconLogin,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import SermonCard from "../components/SermonCard";
import EncontroComDeusModal from "../components/EncontroComDeusModal";
import ThemeToggle from "../components/ThemeToggle";
import { useState, useEffect } from "react";
import { useClientColorScheme } from "../lib/hooks/useClientColorScheme";
import { Sermon } from "../lib/types/Sermon";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

interface ClientHomePageProps {
  sermons: Sermon[];
  lastUpdated: string;
}

export default function ClientHomePage({
  sermons,
  lastUpdated,
}: ClientHomePageProps) {
  const [eventType, setEventType] = useState<string>("");
  const [modalOpened, setModalOpened] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isDark, mounted } = useClientColorScheme();
  const router = useRouter();

  // Verificar se o usuário está logado via Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Filtrar sermões por tipo de evento se selecionado
  const filteredSermons = eventType
    ? sermons.filter((sermon) => sermon.eventType === eventType)
    : sermons;

  if (!mounted) {
    return null;
  }

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
            <Group gap="sm">
              <ThemeToggle />
              <Button
                leftSection={<IconClipboardTextFilled size={16} />}
                variant="white"
                color="violet"
                size="sm"
                fw={600}
                onClick={() => setModalOpened(true)}
              >
                Encontro com Deus
              </Button>
              {isLoggedIn ? (
                <Button
                  leftSection={<IconLayoutDashboard size={16} />}
                  variant="light"
                  color="white"
                  size="sm"
                  fw={600}
                  onClick={() => router.push("/dashboard")}
                  style={{ color: "white" }}
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  leftSection={<IconLogin size={16} />}
                  variant="light"
                  color="white"
                  size="sm"
                  fw={600}
                  onClick={() => router.push("/login")}
                  style={{ color: "white" }}
                >
                  Login
                </Button>
              )}
            </Group>
          </Group>
        </Container>
      </Box>

      <Container size="xl" py="3rem">
        {/* Hero Section */}
        <Stack align="center" gap="xl" mb="3rem">
          <Title
            order={1}
            size="2.5rem"
            fw={800}
            ta="center"
            c={isDark ? "gray.1" : "gray.8"}
            lh={1.1}
          >
           Seja bem vindo ao nosso sistema de sermões e devocionais da igreja No'ah
          </Title>
          <Text
            size="xl"
            c={isDark ? "gray.4" : "gray.6"}
            maw={600}
            ta="center"
            lh={1.6}
          >
            Descubra uma coleção de sermões inspiradores e devocionais que vão
            fortalecer sua jornada de fé
          </Text>

          {/* Informação sobre cache */}
          <Text
            size="sm"
            c={isDark ? "gray.5" : "gray.5"}
            ta="center"
            fs="italic"
          >
            Última atualização:{" "}
            {new Date(lastUpdated).toLocaleDateString("pt-BR")}
          </Text>
        </Stack>

        {/* Filtros */}
        <Box mb="2rem">
          <Group justify="center">
            <Select
              placeholder="Filtrar por tipo"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: "", label: "Todos os tipos" },
                { value: "Culto", label: "Cultos" },
                { value: "Outro", label: "Sermões" },
                { value: "Estudo Bíblico", label: "Estudos Bíblicos" },
                { value: "Retiro", label: "Retiros" },
                { value: "Conferência", label: "Conferências" },
              ]}
              value={eventType}
              onChange={(value) => setEventType(value || "")}
              w={250}
              size="md"
              radius="xl"
            />
          </Group>
        </Box>

        {/* Conteúdo */}
        <Box>
          {filteredSermons.length === 0 && (
            <Paper
              p="3rem"
              radius="xl"
              bg={isDark ? "dark.6" : "gray.1"}
              ta="center"
              shadow="sm"
            >
              <Stack align="center" gap="lg">
                <IconClipboardTextFilled
                  size={48}
                  color={
                    isDark
                      ? "var(--mantine-color-gray-5)"
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

          {filteredSermons.length > 0 && (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="2rem">
              {filteredSermons.map((sermon) => (
                <SermonCard
                  key={sermon.id}
                  slug={sermon.id}
                  description={sermon.description}
                  eventType={sermon.eventType}
                  title={sermon.title}
                  speaker={sermon.speaker}
                  date={sermon.date}
                  duration={sermon.duration || ""}
                />
              ))}
            </SimpleGrid>
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
                      href="https://instagram.com/brunosimoes02"
                      target="_blank"
                      c="white"
                      size="sm"
                      fw={500}
                    >
                      Pastor Bruno
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
                </Stack>
              </Stack>
            </Grid.Col>

            {/* Localização */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                <Title order={4} c="white" fw={600}>
                  Nossa localização:
                </Title>

                <Group gap="sm" align="flex-start">
                  <IconMapPin
                    size={20}
                    color="white"
                    style={{ marginTop: 2 }}
                  />
                  <Stack gap={0}>
                    <Text c="white" size="sm" fw={500}>
                      R. Cícero de Campos Póvoa, 42 Guapituba Mauá
                    </Text>
                    <Text c="white" size="sm" fw={500}>
                      Mauá - SP, 09390-260
                    </Text>
                  </Stack>
                </Group>

                <Divider color="violet.4" />

                <Text c="gray.3" size="xs" ta="center">
                  © {new Date().getFullYear()} Igreja No'ah Guapituba. Todos os direitos reservados.
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Modal */}
      <EncontroComDeusModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </Box>
  );
}
