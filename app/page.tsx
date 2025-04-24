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
} from "@mantine/core";
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
    <Container px="md" py="xl" size="xl">
      <Stack justify="center" mb="xl">
        <Title order={1} ta="center">
          {"No'ah"}
        </Title>
        <Title ta="center" order={2}>
          Seja Bem vindo(a) 🙌
        </Title>
      </Stack>

      <Flex justify={"center"} gap={"md"} align="center">
        <Text mb={"xl"}> Filtre aqui o tipo de Evento </Text>
        <Select
          data={[
            { value: "", label: "Todos" },
            { value: "culto", label: "Culto" },
            { value: "evento", label: "Evento" },
            { value: "reuniao", label: "Reunião" },
          ]}
          value={eventType}
          onChange={(value) => setEventType(value || "")}
          mb={"xl"}
        />
      </Flex>

      {isLoading && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {[...Array(6)].map((_, i) => (
            <SermonCardSkeleton key={i} />
          ))}
        </SimpleGrid>
      )}

      {!isLoading && sermons.length === 0 && (
        <Text ta="center">Nenhum sermão publicado encontrado.</Text>
      )}
      {!isLoading && sermons.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
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
        <Text c="red" ta="center" mt="lg">
          Ocorreu um erro ao carregar os sermões.
        </Text>
      )}

      {hasNextPage && (
        <Button
          fullWidth
          variant="outline"
          mt="xl"
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          Carregar mais
        </Button>
      )}
    </Container>
  );
}
