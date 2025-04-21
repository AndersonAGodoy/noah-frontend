"use client";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Select,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import {
  IconCirclePlus,
  IconPencilCheck,
  IconSquareRoundedX,
} from "@tabler/icons-react";
import { useSermon } from "../../../../../lib/hooks/useSermon";
import { useUpdateSermon } from "../../../../../lib/hooks/useUpdateSermon";

export default function AddSermon() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [eventType, setEventType] = useState("Culto");
  const updateSermon = useUpdateSermon();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, isLoading } = useSermon(id);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setTitle(data.title || "");
      setDescription(data.description || "");
      setSpeaker(data.speaker || "");
      setDuration(data.duration || "");
      setDate(data.date || "");
      setTime(data.time || "");
      setEventType(data.eventType || "Culto");
      setReferences(data.references || [{ reference: "", text: "" }]);
      setContentSections(
        data.contentSections?.length
          ? data.contentSections.map((section) => ({
              ...section,
            }))
          : [{ type: "parágrafo", content: "" }]
      );
    }
  }, [data]);

  //Referencia biblica
  const [references, setReferences] = useState<
    { id?: string; reference: string; text: string }[]
  >([{ reference: "", text: "" }]);

  //sessões
  const [contentSections, setContentSections] = useState<
    {
      id?: string;
      type: string;
      content: string;
    }[]
  >([{ type: "parágrafo", content: "" }]);

  const addScriptureReference = () => {
    setReferences([...references, { reference: "", text: "" }]);
  };

  const updateReference = (
    index: number,
    field: "reference" | "text",
    value: string
  ) => {
    const updatedReferences = [...references];
    updatedReferences[index][field] = value;
    setReferences(updatedReferences);
  };

  const addContentSession = (type: string) => {
    setContentSections([...contentSections, { type, content: "" }]);
  };

  const updateContentSection = (
    index: number,
    field: string,
    value: string
  ) => {
    const newSections = [...contentSections];
    // @ts-ignore - We know these fields exist on the objects
    newSections[index][field] = value;
    setContentSections(newSections);
  };

  const removeContentSection = (index: number) => {
    const newSections = [...contentSections];
    newSections.splice(index, 1);
    setContentSections(newSections);
  };

  const handleUpdateSermon = (id: string) => {
    try {
      const sermonData = {
        title,
        description,
        speaker,
        duration,
        date,
        time,
        eventType,
        contentSections,
        references,
      };
      updateSermon.mutateAsync({
        id,
        ...sermonData,
      });
      setTitle("");
      setDescription("");
      setSpeaker("");
      setDuration("");
      setDate("");
      setTime("");
      setEventType("Culto");
      setReferences([{ reference: "", text: "" }]);
      setContentSections([{ type: "parágrafo", content: "" }]);
      router.push("/dashboard?updated=true");
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Erro",
        message: "Falha ao Atualizar o sermão.",
        color: "red",
      });
    }
  };

  return (
    <Box flex={1}>
      <Title order={1}>Editar Sermão</Title>

      <Tabs defaultValue="information" mt="md">
        <Tabs.List grow>
          <Tabs.Tab color="violet" value="information">
            Informações básicas
          </Tabs.Tab>
          <Tabs.Tab color="violet" value="data">
            Data e hora
          </Tabs.Tab>
          <Tabs.Tab color="violet" value="content">
            Conteúdo do Sermão
          </Tabs.Tab>
          <Tabs.Tab color="violet" value="reference">
            Referências bíblicas
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="information">
          <Box mt="md">
            <TextInput
              label="Título do Sermão"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do Sermão"
              variant="filled"
            />
            <Textarea
              label="Breve descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição do Sermão"
              variant="filled"
              resize="vertical"
              mt="md"
            />
            <Flex gap="md" justify={"space-between"}>
              <TextInput
                label="Palestrante"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Ex: Pastor Bruno"
                variant="filled"
                mt="md"
                flex={1}
              />
              <TextInput
                label="Duração"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 45 minutos"
                variant="filled"
                mt="md"
                flex={1}
              />
            </Flex>
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="data">
          <Grid>
            <Grid.Col span={isMobile ? 12 : 6}>
              <TextInput
                label="Data"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 14 de Outubro"
                variant="filled"
                mt="md"
              />
            </Grid.Col>
            <Grid.Col span={isMobile ? 12 : 6}>
              <TextInput
                label="Hora"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                mt="md"
                placeholder="Ex: 19:00"
                variant="filled"
              />
            </Grid.Col>
          </Grid>
          <Select
            label="Tipo de evento ou culto"
            value={eventType}
            onChange={(value) => setEventType(value || "")}
            variant="filled"
            mt="md"
            placeholder="Selecione o tipo de evento"
            data={[
              { value: "culto", label: "Culto" },
              { value: "reuniao", label: "Reunião" },
              { value: "evento", label: "Evento" },
            ]}
          />
        </Tabs.Panel>

        <Tabs.Panel value="content">
          <Group
            mt={"md"}
            justify="space-between"
            align={isMobile ? "flex-start" : "center"}
            style={{
              flexDirection: isMobile ? "column" : "row",
              width: "100%",
            }}
          >
            <Title order={3}>Sessões</Title>
            <Flex
              justify="space-between"
              align="center"
              gap={"xs"}
              style={{
                flexDirection: isMobile ? "column" : "row",
                width: isMobile ? "100%" : "auto",
              }}
            >
              <Button
                color="violet"
                fullWidth={isMobile}
                onClick={() => addContentSession("parágrafo")}
                leftSection={<IconCirclePlus />}
              >
                Adicionar parágrafo
              </Button>
              <Button
                color="violet"
                fullWidth={isMobile}
                onClick={() => addContentSession("header")}
                leftSection={<IconCirclePlus />}
              >
                Adicionar subtítulo
              </Button>
              <Button
                color="violet"
                fullWidth={isMobile}
                onClick={() => addContentSession("citação")}
                leftSection={<IconCirclePlus />}
              >
                Adicionar citação
              </Button>
            </Flex>
          </Group>
          {contentSections.map((section, index) => (
            <Card
              key={index}
              shadow="sm"
              mt="md"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group justify="space-between">
                <Text fw={500} tt={"capitalize"}>
                  {section.type}
                </Text>
                <Button
                  variant="subtle"
                  color="red"
                  onClick={() => removeContentSection(index)}
                  disabled={contentSections.length === 1}
                >
                  Remover
                </Button>
              </Group>
              {section.type === "parágrafo" && (
                <>
                  <Textarea
                    label="Adicione aqui o conteúdo do parágrafo"
                    value={section.content}
                    onChange={(e) =>
                      updateContentSection(index, "content", e.target.value)
                    }
                    placeholder="Conteúdo do parágrafo"
                    variant="filled"
                    resize="vertical"
                    mt="md"
                  />
                </>
              )}
              {section.type === "header" && (
                <TextInput
                  label="Header"
                  value={section.content}
                  onChange={(e) =>
                    updateContentSection(index, "content", e.target.value)
                  }
                  placeholder="Título do header"
                  variant="filled"
                  mt="md"
                />
              )}
              {section.type === "citação" && (
                <TextInput
                  label="Citação"
                  value={section.content}
                  onChange={(e) =>
                    updateContentSection(index, "content", e.target.value)
                  }
                  placeholder="Adicione aqui a citação"
                  variant="filled"
                  mt="md"
                />
              )}
            </Card>
          ))}
        </Tabs.Panel>
        <Tabs.Panel value="reference">
          <Group
            mt={"md"}
            justify="space-between"
            align={isMobile ? "flex-start" : "center"}
            style={{
              flexDirection: isMobile ? "column" : "row",
              width: "100%",
            }}
          >
            <Title order={3}>Referências bíblicas</Title>
            <Button
              color="violet"
              onClick={addScriptureReference}
              leftSection={<IconCirclePlus />}
            >
              Adicionar referência
            </Button>
          </Group>
          {references.map((reference, index) => (
            <Card
              key={index}
              shadow="sm"
              mt="md"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group justify="space-between">
                <Text fw={500}>Referência {index + 1}</Text>
                <Button
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    const newReferences = [...references];
                    newReferences.splice(index, 1);
                    setReferences(newReferences);
                  }}
                  disabled={references.length === 1}
                >
                  Remover
                </Button>
              </Group>
              <TextInput
                label="Referência"
                placeholder="Ex: João 3:16"
                variant="filled"
                mt="md"
                value={reference.reference}
                onChange={(e) =>
                  updateReference(index, "reference", e.target.value)
                }
              />
              <Textarea
                label="Texto da referência"
                placeholder="Texto da referência bíblica"
                variant="filled"
                resize="vertical"
                mt="md"
                value={reference.text}
                onChange={(e) => updateReference(index, "text", e.target.value)}
              />
            </Card>
          ))}
          <Flex justify={"flex-end"} mt="md" gap="xs">
            <Button
              color="violet"
              onClick={() => id && handleUpdateSermon(id)}
              leftSection={<IconPencilCheck />}
            >
              Atualizar Sermão
            </Button>
            <Button
              variant="subtle"
              color="red"
              onClick={() => router.back()}
              leftSection={<IconSquareRoundedX />}
            >
              Cancelar
            </Button>
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
