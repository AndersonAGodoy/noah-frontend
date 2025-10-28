"use client";

import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Button,
  Group,
  Select,
  NumberInput,
  Text,
  Box,
  Paper,
  Checkbox,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useTransition } from "react";

import {
  encontroComDeusSchema,
  type EncontroComDeusFormData,
} from "../lib/schemas";
import { zodResolver } from "../lib/utils/zodResolver";
import useCreateParticipantFirebase from "../lib/hooks/useCreateParticipantFirebase";
import { useGetActiveEncounter } from "../lib/hooks/useGetActiveEncounter";
import { PhoneInput } from "../lib/utils/phoneUtils";

interface EncontroComDeusModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function EncontroComDeusModal({
  opened,
  onClose,
}: EncontroComDeusModalProps) {
  const [isPending, startTransition] = useTransition();
  const { mutateAsync: createParticipant } = useCreateParticipantFirebase();
  const { data: activeEncounter, isLoading: isLoadingEncounter } =
    useGetActiveEncounter();
  const form = useForm<EncontroComDeusFormData>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      phoneNumber: "",
      email: "",
      age: 18,
      address: "",
      observations: "",
      typeOfParticipation: "firstTime" as const,
    },
    validate: zodResolver(encontroComDeusSchema),
  });

  const handleSubmit = async (values: EncontroComDeusFormData) => {
    startTransition(async () => {
      try {
        await createParticipant({
          ...values,
          observations: values.observations ?? "",
          encounterId: activeEncounter?.id || "default-encounter",
        });

        notifications.show({
          title: "Inscrição realizada com sucesso!",
          message: "Entraremos em contato em breve com mais informações.",
          color: "green",
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });

        form.reset();
        onClose();
      } catch (error) {
        console.error("Erro ao criar participante:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Tente novamente mais tarde ou entre em contato conosco.";

        notifications.show({
          title: "Erro ao realizar inscrição",
          message: errorMessage,
          color: "red",
          icon: <IconX size="1rem" />,
          autoClose: 5000,
        });
        form.reset();
        onClose();
      }
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Inscrição - Encontro com Deus"
      size="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={{
        content: {
          maxHeight: "90vh",
          overflowY: "auto",
        },
        title: {
          color: "var(--mantine-color-violet-7)",
          fontWeight: 700,
          fontSize: "var(--mantine-font-size-xl)",
        },
      }}
    >
      <Box p="md">
        {isLoadingEncounter ? (
          <div className="flex justify-center items-center py-8">
            <Text>Carregando informações do encontro...</Text>
          </div>
        ) : !activeEncounter ? (
          <div className="text-center py-8">
            <Text c="red" mb="md">
              Não há encontro ativo no momento.
            </Text>
            <Text c="gray.6" size="sm">
              Entre em contato com a organização para mais informações.
            </Text>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <div className="mt-2 text-sm text-blue-700">
                    <h1 className="font-semibold">{activeEncounter.title}</h1>
                    <h4 className="font-medium">
                      Quando:{" "}
                      {(activeEncounter.startDate instanceof Date
                        ? activeEncounter.startDate
                        : activeEncounter.startDate.toDate()
                      ).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </h4>
                    {activeEncounter.location && (
                      <h4>Local: {activeEncounter.location}</h4>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Text c="gray.6" mb="xl" size="sm">
              Preencha os dados abaixo para se inscrever no Encontro com Deus.
              Todos os campos marcados com{" "}
              <Text span c={"red"} fw={700}>
                *
              </Text>{" "}
              são obrigatórios.
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Nome completo"
                  placeholder="Digite seu nome completo"
                  required
                  {...form.getInputProps("name")}
                  radius="md"
                />

                <Group grow>
                  <PhoneInput
                    required
                    radius="md"
                    value={form.getValues().phoneNumber || ''}
                    onChange={(value) => form.setFieldValue("phoneNumber", value)}
                    error={form.errors.phoneNumber}
                  />

                  <NumberInput
                    label="Idade"
                    placeholder="Digite sua idade"
                    required
                    min={1}
                    max={120}
                    {...form.getInputProps("age")}
                    radius="md"
                  />
                </Group>

                <TextInput
                  label="Email"
                  placeholder="seu.email@exemplo.com"
                  required
                  type="email"
                  {...form.getInputProps("email")}
                  radius="md"
                />

                <TextInput
                  label="Endereço"
                  placeholder="Rua, número, bairro, cidade"
                  {...form.getInputProps("address")}
                  radius="md"
                />

                <Select
                  label="Tipo de participação"
                  placeholder="Selecione uma opção"
                  required
                  data={[
                    { value: "firstTime", label: "Primeira vez no encontro" },
                    { value: "returning", label: "Já participei antes" },
                    { value: "leadership", label: "Quero ajudar na liderança" },
                  ]}
                  {...form.getInputProps("typeOfParticipation")}
                  radius="md"
                />

                <Textarea
                  label="Observações"
                  placeholder="Alguma observação especial, necessidade ou pedido de oração?"
                  minRows={3}
                  {...form.getInputProps("observations")}
                  radius="md"
                />
                <Text c="gray.6" size="sm">
                  Estou ciente da minha participação em um encontro espiritual
                  promovido pela{" "}
                  <Text span c={"violet.7"} fw={700}>
                    Igreja No'ah Cristã
                  </Text>{" "}
                  com enfoque na fé cristâ e baseado na liturgia da igreja
                  evangélica, durante o período da minha participação me
                  submeterei aos organizadores, às atividades e as normas e
                  horários do evento.
                </Text>
                <Text c="gray.6" size="sm">
                  Declaro-me ciente também que este retiro é estritamente
                  espiritual onde estarei ouvindo e aprendendo da Palavra de
                  Deus, através da Bíblia Sagrada e que não haverá nenhuma
                  atividade de lazer (como piscina, futebol, jogos ou qualquer
                  atividade recreativa), pois trata-se de meu Encontro com Deus.
                </Text>
                <Text c="gray.6" size="sm">
                  Caso não possa ir para o Encontro, por qualquer motivo,
                  declaro-me ciente que não haverá a devolução do valor da
                  inscrição e que ficarei responsável por informar à secretaria
                  qual o próximo Encontro que estarei disponível e em condição
                  de participar.
                </Text>
                <Text c="gray.6" size="sm">
                  Os pertences esquecidos na chácara serão guardados pelo prazo
                  de 15 dias, caso o interessado não entrar em contato com a
                  secretaria o pertence será doado para um das{" "}
                  <Text span c={"violet.7"} fw={700}>
                    Igrejas No'ah
                  </Text>
                  .
                </Text>
                <Text c="gray.6" size="sm">
                  Por fim, comprometo-me a participar do Pré-Encontro que se
                  realizará na quarta-feira às 20h que antecede a data do início
                  do Encontro, bem como, o do Pós-Encontro.
                </Text>
                <Checkbox
                  c="gray.6"
                  color="violet"
                  label="Declaro que li e estou de acordo com os termos acima."
                />

                <Group justify="flex-end" mt="xl">
                  <Button
                    variant="subtle"
                    color="gray"
                    onClick={onClose}
                    disabled={isPending}
                    radius="md"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    loading={isPending}
                    variant="gradient"
                    gradient={{ from: "violet.6", to: "violet.8" }}
                    radius="md"
                    px="xl"
                  >
                    Confirmar Inscrição
                  </Button>
                </Group>
              </Stack>
            </form>
          </>
        )}
      </Box>
    </Modal>
  );
}
