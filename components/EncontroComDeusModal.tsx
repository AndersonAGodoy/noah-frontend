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
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";

interface EncontroComDeusModalProps {
  opened: boolean;
  onClose: () => void;
}

interface FormValues {
  nome: string;
  telefone: string;
  email: string;
  idade: number | undefined;
  endereco: string;
  observacoes: string;
  tipoParticipacao: string;
}

export default function EncontroComDeusModal({
  opened,
  onClose,
}: EncontroComDeusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      nome: "",
      telefone: "",
      email: "",
      idade: undefined,
      endereco: "",
      observacoes: "",
      tipoParticipacao: "",
    },
    validate: {
      nome: (value) => (value.trim().length < 2 ? "Nome é obrigatório" : null),
      telefone: (value) =>
        value.trim().length < 10 ? "Telefone é obrigatório" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"),
      idade: (value) =>
        value && value > 0 && value < 120 ? null : "Idade deve ser válida",
      tipoParticipacao: (value) =>
        value ? null : "Selecione o tipo de participação",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Simular envio dos dados - aqui você implementaria a chamada para sua API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Dados da inscrição:", values);

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
      notifications.show({
        title: "Erro ao realizar inscrição",
        message: "Tente novamente mais tarde ou entre em contato conosco.",
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
        <Text c="gray.6" mb="xl" size="sm">
          Preencha os dados abaixo para se inscrever no Encontro com Deus. Todos
          os campos marcados com{" "}
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
              {...form.getInputProps("nome")}
              radius="md"
            />

            <Group grow>
              <TextInput
                label="Telefone"
                placeholder="(11) 99999-9999"
                required
                {...form.getInputProps("telefone")}
                radius="md"
              />

              <NumberInput
                label="Idade"
                placeholder="Digite sua idade"
                required
                min={1}
                max={120}
                {...form.getInputProps("idade")}
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
              {...form.getInputProps("endereco")}
              radius="md"
            />

            <Select
              label="Tipo de participação"
              placeholder="Selecione uma opção"
              required
              data={[
                { value: "primeira-vez", label: "Primeira vez no encontro" },
                { value: "ja-participei", label: "Já participei antes" },
                { value: "lideranca", label: "Quero ajudar na liderança" },
              ]}
              {...form.getInputProps("tipoParticipacao")}
              radius="md"
            />

            <Textarea
              label="Observações"
              placeholder="Alguma observação especial, necessidade ou pedido de oração?"
              minRows={3}
              {...form.getInputProps("observacoes")}
              radius="md"
            />
            <Text c="gray.6" size="sm">
              Estou ciente da minha participação em um encontro espiritual
              promovido pela{" "}
              <Text span c={"violet.7"} fw={700}>
                Igreja No'ah Cristã
              </Text>{" "}
              com enfoque na fé cristâ e baseado na liturgia da igreja
              evangélica, durante o período da minha participação me submeterei
              aos organizadores, às atividades e as normas e horários do evento.
            </Text>
            <Text c="gray.6" size="sm">
              Declaro-me ciente também que este retiro é estritamente espiritual
              onde estarei ouvindo e aprendendo da Palavra de Deus, através da
              Bíblia Sagrada e que não haverá nenhuma atividade de lazer (como
              piscina, futebol, jogos ou qualquer atividade recreativa), pois
              trata-se de meu Encontro com Deus.
            </Text>
            <Text c="gray.6" size="sm">
              Caso não possa ir para o Encontro, por qualquer motivo, declaro-me
              ciente que não haverá a devolução do valor da inscrição e que
              ficarei responsável por informar à secretária qual o próximo
              Encontro que estarei disponível e em condição de participar.
            </Text>
            <Text c="gray.6" size="sm">
              Os pertences esquecidos na chácara serão guardados pelo prazo de
              15 dias, caso o interessado não entrar em contato com a secretaria
              o pertence será doado para um das{" "}
              <Text span c={"violet.7"} fw={700}>
                Igrejas No'ah
              </Text>
              .
            </Text>
            <Text c="gray.6" size="sm">
              Por fim, comprometo-me a participar do Pré-Encontro que se
              realizará na quarta-feira às 20h que antecede a data do início do
              Encontro, bem como, o do Pós-Encontro.
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
                disabled={isSubmitting}
                radius="md"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
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
      </Box>
    </Modal>
  );
}
