"use client";
import {
  Blockquote,
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
import { useState } from "react";
import useCreateSermon from "../../../../lib/hooks/useCreateSermon";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import {
  IconBible,
  IconCirclePlus,
  IconSquareRoundedX,
} from "@tabler/icons-react";

export default function AddSermon() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [eventType, setEventType] = useState("Culto");
  const { mutate: createSermon } = useCreateSermon();
  const router = useRouter();

  //Referencia biblica
  const [references, setReferences] = useState([{ reference: "", text: "" }]);

  //sessões
  const [contentSections, setContentSections] = useState([
    { type: "parágrafo", content: "" },
  ]);

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

  const handleCreateSermon = () => {
    try {
      const sermonData = {
        title,
        description,
        speaker,
        duration,
        date,
        time,
        eventType,
        references,
        contentSections,
      };
      createSermon(sermonData);
      setTitle("");
      setDescription("");
      setSpeaker("");
      setDuration("");
      setDate("");
      setTime("");
      setEventType("Culto");
      setReferences([{ reference: "", text: "" }]);
      setContentSections([{ type: "parágrafo", content: "" }]);

      // Redirect to dashboard or another page
      router.push("/dashboard?created=true");
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: "Falha ao criar o sermão.",
        color: "red",
      });
    }
    // Reset form fields
  };

  return (
    <Box flex={1}>
      <Title order={1}>Criar um novo Sermão</Title>

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
            label="Tipo de conteúdo"
            value={eventType}
            onChange={(value) => setEventType(value || "")}
            variant="filled"
            mt="md"
            placeholder="Selecione o tipo de conteúdo"
            data={[
              { value: "culto", label: "Culto" },
              { value: "devocional", label: "Devocional" },
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
          <Title order={4} mt="xl" mb="md">
            Pré-visualização
          </Title>
          <Card withBorder p="md">
            {contentSections.map((section, index) => {
              switch (section.type) {
                case "parágrafo":
                  return (
                    <Text key={index} mb="md">
                      {section.content || "(Parágrafo vazio)"}
                    </Text>
                  );
                case "header":
                  return (
                    <Title key={index} order={4} c="violet" mb="md">
                      {section.content || "(Título vazio)"}
                    </Title>
                  );
                case "citação":
                  return (
                    <Blockquote
                      key={index}
                      c="violet"
                      mb="md"
                      icon={<IconBible size={18} />}
                    >
                      {section.content || "(Citação vazia)"}
                    </Blockquote>
                  );
                default:
                  return null;
              }
            })}
          </Card>
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
              onClick={handleCreateSermon}
              leftSection={<IconCirclePlus />}
            >
              Criar Sermão
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
