// Exemplo de Componente Migrado para Firebase
// components/EncontroComDeusModal.firebase.example.tsx

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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import useCreateParticipantFirebase from "../lib/hooks/useCreateParticipantFirebase";
import {
  encontroComDeusSchema,
  type EncontroComDeusFormData,
} from "../lib/schemas";
import { zodResolver } from "../lib/utils/zodResolver";

interface EncontroComDeusModalProps {
  opened: boolean;
  onClose: () => void;
  encounterId: string; // Novo: ID do encontro
}

export default function EncontroComDeusModal({
  opened,
  onClose,
  encounterId,
}: EncontroComDeusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createParticipant } = useCreateParticipantFirebase();

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
    setIsSubmitting(true);

    try {
      // Novo: Usar Firebase ao invés de fetch
      await createParticipant({
        ...values,
        observations: values.observations ?? "",
        encounterId, // Novo: Passar ID do encontro
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
      // console.error("Erro ao criar participante:", error);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Inscrição - Encontro com Deus"
      size="lg"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Nome completo"
            placeholder="Seu nome"
            {...form.getInputProps("name")}
            required
          />

          <TextInput
            label="Email"
            placeholder="seu@email.com"
            type="email"
            {...form.getInputProps("email")}
            required
          />

          <TextInput
            label="Telefone"
            placeholder="(11) 99999-9999"
            {...form.getInputProps("phoneNumber")}
            required
          />

          <NumberInput
            label="Idade"
            placeholder="30"
            {...form.getInputProps("age")}
            required
            min={1}
            max={120}
          />

          <TextInput
            label="Endereço"
            placeholder="São Paulo, SP"
            {...form.getInputProps("address")}
          />

          <Textarea
            label="Observações"
            placeholder="Alguma informação importante?"
            {...form.getInputProps("observations")}
          />

          <Select
            label="Tipo de Participação"
            placeholder="Selecione o tipo"
            data={[
              { value: "firstTime", label: "Primeira vez no encontro" },
              { value: "returning", label: "Já participei antes" },
              { value: "leadership", label: "Sou liderança" },
            ]}
            {...form.getInputProps("typeOfParticipation")}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Inscrever
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

// Uso do componente:
// <EncontroComDeusModal
//   opened={opened}
//   onClose={onClose}
//   encounterId="encontro-123"
// />
