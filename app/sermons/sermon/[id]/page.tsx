"use client";
import {
  Blockquote,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconBible,
  IconCalendar,
  IconClock,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSermon from "../../../../lib/hooks/useSermon";

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

const renderContentSection = (section: ContentSection) => {
  const icon = <IconBible stroke={1.5} />;
  
  switch(section.type.toLowerCase()) {
    case 'parágrafo':
      return (
        <Text key={section.id} size="lg" mb="md" ta="justify">
          {section.content}
        </Text>
      );
    case 'header':
    case 'subtítulo':
    case 'titulo':
      return (
        <Title key={section.id} order={4} mb="md" c={"violet"}>
          {section.content}
        </Title>
      );
    case 'citação':
    case 'citacao':
      return (
        <Blockquote
          key={section.id}
          fz={"lg"}
          mb={"lg"}
          mt={"lg"}
          color="violet"
          icon={icon}
          ff={"Playfair Display, sans-serif"}
          fs={"italic"}
        >
          {section.content}
        </Blockquote>
      );
    default:
      return (
        <Text key={section.id} size="lg" mb="md">
          {section.content}
        </Text>
      );
  }
};

export default function SermonPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, isLoading } = useSermon(id);
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isLoading) return <Text>Carregando..</Text>;

  return (
    <Container px="md" py="xl" size="lg">
      <Button
        component={Link}
        href={"/"}
        variant="subtle"
        mb={"xl"}
        color="violet"
        leftSection={<IconArrowLeft size={16} />}
      >
        Voltar para os sermões
      </Button>

      <Grid>
        <Grid.Col span={isMobile ? 12 : 7}>
          <Image
            src={"/noah_logo.jpg"}
            alt={"Noah Logo"}
            width={isMobile ? 340 : 640}
            height={isMobile ? 200 : 400}
            style={{
              objectFit: "cover",
              borderRadius: 8,
              marginBottom: 16,
            }}
          />

          <Title order={1} c={"violet"}>
            {data?.title}
          </Title>
          <Flex gap="md" mb="lg">
            <Flex gap={2} align="center" c={"dimmed"}>
              <IconUser size={16} stroke={1.5} />
              <Text size="sm">{data?.speaker}</Text>
            </Flex>
            <Flex gap={2} align="center" c={"dimmed"}>
              <IconCalendar size={16} stroke={1.5} />
              <Text size="sm">{data?.date}</Text>
            </Flex>
            <Flex gap={2} align="center" c={"dimmed"}>
              <IconClock size={16} stroke={1.5} />
              <Text size="sm">{data?.duration}</Text>
            </Flex>
          </Flex>

          <Stack gap="md">
            {data?.contentSections?.map(renderContentSection)}
          </Stack>
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 5}>
          <Card withBorder mb="md">
            <Title order={3} mb="md" c={"violet"}>
              Referências Bíblicas
            </Title>
            {data?.references?.map((reference: Reference) => (
              <Box key={reference.id}>
                <Title order={5}>{reference.reference}</Title>
                <Text c="dimmed" mb="md">
                  {reference.text}
                </Text>
              </Box>
            ))}
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}