"use client";
import {
  Blockquote,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
  Anchor,
  Group,
  Divider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconBible,
  IconCalendar,
  IconClock,
  IconUser,
  IconMapPin,
  IconBrandInstagram,
  IconBrandSpotify,
  IconBrandYoutube,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSermon from "../../../../lib/hooks/useSermon";
import { useClientColorScheme } from "../../../../lib/hooks/useClientColorScheme";

interface ContentSection {
  id: string;
  type: string;
  content: string;
  url?: string;
  alt?: string;
  caption?: string;
}

interface Reference {
  id: string;
  reference: string;
  text: string;
  sermonId: string;
}

interface SermonContentProps {
  contentSections: ContentSection[];
  isDark?: boolean;
}

const SermonContent = ({ contentSections, isDark }: SermonContentProps) => {
  const icon = <IconBible stroke={1.5} />;
  const contentMap: Record<
    string,
    (section: ContentSection) => React.ReactNode
  > = {
    parágrafo: (section) => (
      <Text
        key={section.id}
        size="lg"
        mb="lg"
        ta="justify"
        lh={1.8}
        c={isDark ? "gray.3" : "dark.7"}
      >
        {section.content}
      </Text>
    ),
    header: (section) => (
      <Title key={section.id} order={3} mb="lg" mt="xl" c="violet.6" fw={600}>
        {section.content}
      </Title>
    ),
    citação: (section) => (
      <Blockquote
        key={section.id}
        fz="lg"
        mb="xl"
        mt="xl"
        p="lg"
        color="violet"
        icon={icon}
        ff="Playfair Display, serif"
        fs="italic"
        bg={isDark ? "violet.9" : "violet.0"}
        styles={{
          root: {
            borderLeftWidth: 4,
            borderRadius: 8,
          },
        }}
      >
        {section.content}
      </Blockquote>
    ),
  };
  return (
    <Stack gap="md">
      {contentSections.map(
        (section) => contentMap[section.type]?.(section) ?? null
      )}
    </Stack>
  );
};

const SermonPageSkeleton = () => {
  const isMobile = useMediaQuery("(maxWidth: 768px)");
  const { isDark } = useClientColorScheme();

  return (
    <Box bg={isDark ? "dark.8" : "gray.0"} mih="100vh">
      <Container px="md" py="xl" size="lg">
        <Skeleton height={40} width={200} radius="md" mb="xl" />

        <Paper
          shadow="md"
          p={isMobile ? "lg" : "xl"}
          radius="lg"
          bg={isDark ? "dark.6" : "white"}
        >
          <Grid>
            <Grid.Col span={isMobile ? 12 : 7}>
              <Box mb="xl">
                <Skeleton height={isMobile ? 220 : 400} radius="lg" mb="md" />
              </Box>

              <Skeleton height={40} mb="md" />
              <Skeleton height={20} width="60%" mb="xl" />

              <Flex gap="lg" mb="xl" wrap="wrap">
                <Skeleton height={20} width={120} />
                <Skeleton height={20} width={100} />
                <Skeleton height={20} width={80} />
              </Flex>

              <Stack gap="lg">
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={20} width="80%" />
                <Skeleton height={30} width="40%" mt="lg" />
                <Skeleton height={20} />
                <Skeleton height={20} width="90%" />
              </Stack>
            </Grid.Col>

            <Grid.Col span={isMobile ? 12 : 5}>
              {" "}
              <Card
                withBorder
                shadow="sm"
                radius="md"
                p="lg"
                bg={isDark ? "violet.9" : "violet.0"}
                style={{
                  position: isMobile ? "static" : "sticky",
                  top: "2rem",
                }}
                styles={{
                  root: {
                    borderColor: isDark
                      ? "var(--mantine-color-violet-7)"
                      : "var(--mantine-color-violet-2)",
                  },
                }}
              >
                <Skeleton height={24} width="60%" mb="lg" />
                <Stack gap="lg">
                  {[...Array(3)].map((_, i) => (
                    <Box key={i}>
                      <Skeleton height={16} width="40%" mb="xs" />
                      <Skeleton height={14} />
                      <Skeleton height={14} width="80%" />
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default function SermonPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, isLoading } = useSermon(id);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isDark } = useClientColorScheme();

  if (isLoading) return <SermonPageSkeleton />;

  return (
    <Box bg={isDark ? "dark.8" : "gray.0"} mih="100vh">
      <Container px="md" py="xl" size="lg">
        <Button
          component={Link}
          href={"/"}
          variant="light"
          mb="xl"
          color="violet"
          size="md"
          leftSection={<IconArrowLeft size={18} />}
          styles={{
            root: {
              borderRadius: 8,
            },
          }}
        >
          Voltar para os sermões
        </Button>

        <Paper
          shadow="md"
          p={isMobile ? "lg" : "xl"}
          radius="lg"
          bg={isDark ? "dark.6" : "white"}
        >
          <Grid>
            <Grid.Col span={isMobile ? 12 : 7}>
              <Box mb="xl">
                <Image
                  src={"/noah_logo.jpg"}
                  alt={"Noah Logo"}
                  width={isMobile ? 340 : 640}
                  height={isMobile ? 220 : 400}
                  style={{
                    objectFit: "cover",
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    height: "auto",
                  }}
                />
              </Box>

              <Title order={1} c="violet.7" mb="md" fw={700} lh={1.2}>
                {data?.title}
              </Title>

              <Flex gap="lg" mb="xl" wrap="wrap">
                {" "}
                <Flex gap={6} align="center" c={isDark ? "gray.4" : "gray.6"}>
                  <IconUser size={18} stroke={1.5} />
                  <Text size="md" fw={500}>
                    {data?.speaker}
                  </Text>
                </Flex>
                <Flex gap={6} align="center" c={isDark ? "gray.4" : "gray.6"}>
                  <IconCalendar size={18} stroke={1.5} />
                  <Text size="md" fw={500}>
                    {data?.date}
                  </Text>
                </Flex>
                <Flex gap={6} align="center" c={isDark ? "gray.4" : "gray.6"}>
                  <IconClock size={18} stroke={1.5} />
                  <Text size="md" fw={500}>
                    {data?.duration}
                  </Text>
                </Flex>
              </Flex>

              {data && (
                <SermonContent
                  contentSections={data.contentSections}
                  isDark={isDark}
                />
              )}
            </Grid.Col>

            <Grid.Col span={isMobile ? 12 : 5}>
              {" "}
              <Card
                withBorder
                shadow="sm"
                radius="md"
                p="lg"
                bg={isDark ? "violet.9" : "violet.0"}
                style={{
                  position: isMobile ? "static" : "sticky",
                  top: "2rem",
                  maxHeight: "calc(100vh - 4rem)",
                  overflowY: "auto",
                }}
                styles={{
                  root: {
                    borderColor: isDark
                      ? "var(--mantine-color-violet-7)"
                      : "var(--mantine-color-violet-2)",
                  },
                }}
              >
                <Title
                  order={3}
                  mb="lg"
                  c={isDark ? "violet.2" : "violet.7"}
                  fw={600}
                >
                  Referências Bíblicas
                </Title>
                <Stack gap="lg">
                  {data &&
                    data.references.map((reference: Reference) => (
                      <Box key={reference.id}>
                        <Title
                          order={5}
                          c={isDark ? "violet.2" : "violet.7"}
                          mb="xs"
                          fw={600}
                        >
                          {reference.reference}
                        </Title>
                        <Text
                          c={isDark ? "gray.2" : "gray.7"}
                          size="sm"
                          lh={1.6}
                        >
                          {reference.text}
                        </Text>
                      </Box>
                    ))}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>
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
                    Utilizando a chave PIX:
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
                    "@media (max-width: 768px)": {
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
