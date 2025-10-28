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
  Alert,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import {
  IconCirclePlus,
  IconPencilCheck,
  IconSquareRoundedX,
  IconMarkdown,
  IconInfoCircle,
} from "@tabler/icons-react";
import {
  useGetSermonFirebase,
  useGetSermonsFirebase,
} from "../../../../../lib/hooks/useGetSermonsFirebase";
import useUpdateSermonFirebase from "../../../../../lib/hooks/useUpdateSermonFirebase";
import { useClientColorScheme } from "../../../../../lib/hooks/useClientColorScheme";
import MarkdownEditor from "../../../../../components/MarkdownEditor";
import MarkdownViewer from "../../../../../components/MarkdownViewer";

export default function AddSermon() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isDark } = useClientColorScheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [eventType, setEventType] = useState("Culto");
  const [markdownContent, setMarkdownContent] = useState("");
  const updateSermonMutation = useUpdateSermonFirebase();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? null;
  const { data, isLoading } = useGetSermonFirebase(id as string | null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      setTitle(data.title || "");
      setDescription(data.description || "");
      setSpeaker(data.speaker || "");
      setDuration(data.duration || "");
      setDate(data.date || "");
      setTime(data.time || "");
      setEventType(data.eventType || "Culto");
      setMarkdownContent(data.markdownContent || "");
      setReferences(data.references || []); // Array vazio se não houver referências
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
  >([]); // Inicializa vazio - referências são opcionais

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

  const handleUpdateSermon = async (id: string) => {
    setIsSubmitting(true);
    try {
      const sermonData = {
        title,
        description,
        speaker,
        duration,
        date,
        time,
        eventType: eventType as
          | "Culto"
          | "Estudo Bíblico"
          | "Retiro"
          | "Conferência"
          | "Outro",
        contentSections: contentSections.map((s) => ({
          ...s,
          type: s.type as "parágrafo" | "título" | "lista" | "citacao",
        })),
        references,
        markdownContent,
      };
      await updateSermonMutation.mutateAsync({
        id,
        data: sermonData,
      });
      notifications.show({
        title: "Sucesso!",
        message: "Sermão atualizado com sucesso.",
        color: "green",
      });
      setTitle("");
      setDescription("");
      setSpeaker("");
      setDuration("");
      setDate("");
      setTime("");
      setEventType("Culto");
      setMarkdownContent("");
      setReferences([{ reference: "", text: "" }]);
      setContentSections([{ type: "parágrafo", content: "" }]);
      router.push("/dashboard?updated=true");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Falha ao atualizar o sermão.";
      notifications.show({
        title: "Erro",
        message: errorMessage,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
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
          <Title order={3} mt="md">
            Conteúdo do Sermão
          </Title>
          <Text size="sm" c="dimmed" mt="xs" mb="md">
            Use o editor de markdown para criar e formatar o conteúdo do seu
            sermão. Você pode usar formatação, listas, citações e muito mais.
          </Text>

          <Tabs defaultValue="editor" mt="md">
            <Tabs.List>
              <Tabs.Tab value="editor">Editor</Tabs.Tab>
              <Tabs.Tab value="preview">Visualização</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="editor" pt="md">
              <Box
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: `1px solid ${isDark ? '#373A40' : '#dee2e6'}`,
                }}
              >
                <MarkdownEditor
                  value={markdownContent}
                  onChange={setMarkdownContent}
                  height={600}
                />
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="preview" pt="md">
              <Box
                p="md"
                style={{
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? '#373A40' : '#dee2e6'}`,
                  background: isDark ? '#25262b' : '#fafbfc',
                  minHeight: '600px',
                }}
              >
                <MarkdownViewer
                  content={markdownContent || "Nenhum conteúdo ainda..."}
                />
              </Box>
            </Tabs.Panel>
          </Tabs>
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
            <Title order={3}>Referências bíblicas (Opcional)</Title>
            <Button
              color="violet"
              onClick={addScriptureReference}
              leftSection={<IconCirclePlus />}
            >
              Adicionar referência
            </Button>
          </Group>

          {references.length === 0 && (
            <Alert
              icon={<IconInfoCircle size={16} />}
              title="Nenhuma referência adicionada"
              color="blue"
              variant="light"
              mt="md"
            >
              <Text size="sm">
                As referências bíblicas são opcionais. Clique em "Adicionar
                referência" se desejar incluir textos bíblicos no seu sermão.
              </Text>
            </Alert>
          )}

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
              loading={isSubmitting}
              disabled={isSubmitting}
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
