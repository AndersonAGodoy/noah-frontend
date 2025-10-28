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
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useTransition } from "react";
import useCreateSermonFirebase from "../../../../lib/hooks/useCreateSermonFirebase";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import {
  IconCirclePlus,
  IconSquareRoundedX,
  IconMarkdown,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useClientColorScheme } from "../../../../lib/hooks/useClientColorScheme";
import { sermonSchema, type SermonFormData } from "../../../../lib/schemas";
import { zodResolver } from "../../../../lib/utils/zodResolver";
import MarkdownViewer from "../../../../components/MarkdownViewer";
import dynamic from "next/dynamic";

// Dynamic import do editor pesado
const MarkdownEditor = dynamic(
  () => import("../../../../components/MarkdownEditor"),
  {
    loading: () => <div>Carregando editor...</div>,
    ssr: false,
  }
);

export default function AddSermon() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isDark } = useClientColorScheme();
  const { mutateAsync: createSermon } = useCreateSermonFirebase();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SermonFormData>({
    mode: "controlled",
    initialValues: {
      title: "",
      description: "",
      speaker: "",
      duration: "",
      date: "",
      time: "",
      eventType: "Culto" as const,
      references: [], // Array vazio - referências agora são opcionais
      contentSections: [],
      markdownContent: "", // Novo campo para markdown
    },
    validate: zodResolver(sermonSchema),
  });

  const addScriptureReference = () => {
    const currentReferences = form.values.references;
    form.setFieldValue("references", [
      ...currentReferences,
      { reference: "", text: "" },
    ]);
  };

  const updateReference = (
    index: number,
    field: "reference" | "text",
    value: string
  ) => {
    form.setFieldValue(`references.${index}.${field}`, value);
  };

  const removeReference = (index: number) => {
    const currentReferences = form.values.references;
    const newReferences = currentReferences.filter((_, i) => i !== index);
    form.setFieldValue("references", newReferences);
  };

  const handleCreateSermon = async (values: SermonFormData) => {
    console.log("🚀 handleCreateSermon called with values:", values);
    console.log("🔍 Markdown content length:", values.markdownContent?.length);
    console.log("📝 Form validation errors:", form.errors);

    startTransition(async () => {
      try {
        await createSermon(values);
        notifications.show({
          title: "Sucesso!",
          message: "Sermão criado com sucesso.",
          color: "green",
        });
        form.reset();
        router.push("/dashboard");
      } catch (error) {
        console.error("❌ Error creating sermon:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao criar o sermão.";
        notifications.show({
          title: "Erro",
          message: errorMessage,
          color: "red",
        });
      }
    });
  };

  return (
    <Box flex={1}>
      <Title order={1}>Criar um novo Sermão</Title>

      <form onSubmit={form.onSubmit(handleCreateSermon)}>
        <Tabs defaultValue="information" mt="md">
          <Tabs.List grow>
            <Tabs.Tab color="violet" value="information">
              Informações básicas
            </Tabs.Tab>
            <Tabs.Tab color="violet" value="data">
              Data e hora
            </Tabs.Tab>
            <Tabs.Tab color="violet" value="content">
              <Group gap="xs">
                <IconMarkdown size={16} />
                Conteúdo (Markdown)
              </Group>
            </Tabs.Tab>
            <Tabs.Tab color="violet" value="reference">
              Referências bíblicas
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="information">
            <Box mt="md">
              <TextInput
                label="Título do Sermão"
                {...form.getInputProps("title")}
                placeholder="Título do Sermão"
                variant="filled"
              />
              <Textarea
                label="Breve descrição"
                {...form.getInputProps("description")}
                placeholder="Breve descrição do Sermão"
                variant="filled"
                resize="vertical"
                mt="md"
              />
              <Flex gap="md" justify={"space-between"}>
                <TextInput
                  label="Palestrante"
                  {...form.getInputProps("speaker")}
                  placeholder="Ex: Pastor Bruno"
                  variant="filled"
                  mt="md"
                  flex={1}
                />
                <TextInput
                  label="Duração"
                  {...form.getInputProps("duration")}
                  placeholder="Ex: 45:30"
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
                  {...form.getInputProps("date")}
                  placeholder="Ex: 2025-12-25"
                  variant="filled"
                  mt="md"
                  type="date"
                />
              </Grid.Col>
              <Grid.Col span={isMobile ? 12 : 6}>
                <TextInput
                  label="Hora"
                  {...form.getInputProps("time")}
                  mt="md"
                  placeholder="Ex: 19:00"
                  variant="filled"
                  type="time"
                />
              </Grid.Col>
            </Grid>
            <Select
              label="Tipo de conteúdo"
              {...form.getInputProps("eventType")}
              variant="filled"
              mt="md"
              placeholder="Selecione o tipo de conteúdo"
              data={[
                { value: "Culto", label: "Culto" },
                { value: "Devocional", label: "Devocional" },
                { value: "Estudo Bíblico", label: "Estudo Bíblico" },
                { value: "Retiro", label: "Retiro" },
                { value: "Conferência", label: "Conferência" },
                { value: "Outro", label: "Outro" },
              ]}
            />
          </Tabs.Panel>

          <Tabs.Panel value="content">
            <Alert
              icon={<IconInfoCircle size={16} />}
              title="Editor de Markdown"
              color="blue"
              variant="light"
              mb="md"
              mt="md"
            >
              <Text size="sm">
                Use Markdown para formatar o conteúdo do seu sermão. Alterne
                entre as abas para editar e visualizar.
                <br />
                <strong>Dica:</strong> Use # para títulos, ** para negrito, *
                para itálico, e &gt; para citações.
              </Text>
            </Alert>

            <Tabs defaultValue="editor" variant="pills">
              <Tabs.List mb="md">
                <Tabs.Tab value="editor">✏️ Editar</Tabs.Tab>
                <Tabs.Tab value="preview">👁️ Visualizar</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="editor">
                <MarkdownEditor
                  value={form.values.markdownContent || ""}
                  onChange={(value) =>
                    form.setFieldValue("markdownContent", value)
                  }
                  height={500}
                  placeholder="Digite o conteúdo do seu sermão em Markdown...

# Título Principal do Sermão

## Introdução
Escreva aqui a introdução do seu sermão...

## Desenvolvimento

### Primeiro Ponto
Desenvolvimento do primeiro ponto...

### Segundo Ponto
Desenvolvimento do segundo ponto...

## Conclusão
Conclua seu sermão aqui...

---

> **Versículo chave:** 'Porque Deus amou o mundo de tal maneira...' - João 3:16"
                />
              </Tabs.Panel>

              <Tabs.Panel value="preview">
                {form.values.markdownContent ? (
                  <Card withBorder p="xl" style={{ minHeight: "500px" }}>
                    <MarkdownViewer content={form.values.markdownContent} />
                  </Card>
                ) : (
                  <Card withBorder p="xl" style={{ minHeight: "500px" }}>
                    <Text c="dimmed" ta="center">
                      Nenhum conteúdo para visualizar. Escreva algo na aba
                      "Editar".
                    </Text>
                  </Card>
                )}
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
                type="button"
              >
                Adicionar referência
              </Button>
            </Group>

            {form.values.references.length === 0 && (
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

            {form.values.references.map((reference, index) => (
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
                    onClick={() => removeReference(index)}
                    type="button"
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
                  error={form.errors[`references.${index}.reference`]}
                />
                <Textarea
                  label="Texto da referência"
                  placeholder="Texto da referência bíblica"
                  variant="filled"
                  resize="vertical"
                  mt="md"
                  value={reference.text}
                  onChange={(e) =>
                    updateReference(index, "text", e.target.value)
                  }
                  error={form.errors[`references.${index}.text`]}
                />
              </Card>
            ))}
            <Flex justify={"flex-end"} mt="md" gap="xs">
              <Button
                color="violet"
                type="submit"
                leftSection={<IconCirclePlus />}
                loading={isPending}
                disabled={isPending}
                onClick={() => {
                  console.log("🖱️ Create button clicked!");
                  console.log("📋 Current form values:", form.values);
                  console.log("❌ Current form errors:", form.errors);
                }}
              >
                Criar Sermão
              </Button>
              <Button
                variant="subtle"
                color="red"
                onClick={() => router.back()}
                disabled={isPending}
                leftSection={<IconSquareRoundedX />}
                type="button"
              >
                Cancelar
              </Button>
            </Flex>
          </Tabs.Panel>
        </Tabs>
      </form>
    </Box>
  );
}
