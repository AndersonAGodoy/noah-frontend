"use client";

import {
  Title,
  Text,
  Box,
  Paper,
  Table,
  Badge,
  Button,
  Group,
  Stack,
  Card,
  ActionIcon,
  Tooltip,
  SimpleGrid,
  Select,
  Modal,
  Divider,
} from "@mantine/core";
import {
  useFormattedPhone,
  formatPhoneNumber,
} from "../../../lib/utils/phoneUtils";
import {
  IconArrowLeft,
  IconEye,
  IconDownload,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconUser,
  IconNotes,
} from "@tabler/icons-react";
import Link from "next/link";
import { useClientColorScheme } from "../../../lib/hooks/useClientColorScheme";
import { useState, useMemo } from "react";
import useGetAllParticipantsFirebase from "../../../lib/hooks/useGetAllParticipantsFirebase";
import { useGetEncounters } from "../../../lib/hooks/useGetEncounters";

const getTipoParticipacaoColor = (tipo: string) => {
  switch (tipo) {
    case "firstTime":
      return "blue";
    case "returning":
      return "green";
    case "leadership":
      return "violet";
    default:
      return "gray";
  }
};

const getTipoParticipacaoLabel = (tipo: string) => {
  switch (tipo) {
    case "firstTime":
      return "Primeira vez";
    case "returning":
      return "Já participei";
    case "leadership":
      return "Liderança";
    default:
      return tipo;
  }
};

export default function InteressadosEncontroPage() {
  const { isDark } = useClientColorScheme();
  const [selectedEncontro, setSelectedEncontro] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  // Buscar todos os participantes do Firebase
  const { data: participantsData, isLoading } = useGetAllParticipantsFirebase({
    limit: 1000,
    page: 1,
  });

  // Buscar todos os encontros do Firebase
  const { data: encountersData, isLoading: isLoadingEncounters } =
    useGetEncounters();

  const participants = participantsData?.data || [];
  const encounters = encountersData?.data || [];

  // Criar opções de filtro baseadas nos encontros reais
  const encontrosOptions = useMemo(() => {
    if (!encounters || encounters.length === 0) return [];

    return encounters
      .map((encounter) => {
        const date =
          encounter.startDate instanceof Date
            ? encounter.startDate
            : encounter.startDate.toDate();

        return {
          value: encounter.id,
          label: `${encounter.title} - ${date.toLocaleDateString("pt-BR")}`,
          date: date,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Mais recente primeiro
  }, [encounters]);

  // Filtrar participantes baseado no encontro selecionado
  const inscricoesFiltradas = useMemo(() => {
    if (!selectedEncontro) {
      return participants;
    }

    return participants.filter((p) => p.encounterId === selectedEncontro);
  }, [selectedEncontro, participants]);

  const handleVerDetalhes = (person: any) => {
    setSelectedPerson(person);
    setModalOpened(true);
  };

  const handleExportar = async () => {
    try {
      // Dynamically import jsPDF to avoid SSR issues
      const jsPDF = (await import("jspdf")).default;

      const doc = new jsPDF();

      // Título
      doc.setFontSize(20);
      doc.text("Lista de Interessados - Encontro com Deus", 20, 20);

      // Data do relatório
      doc.setFontSize(12);
      doc.text(
        `Relatório gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
        20,
        35
      );

      if (selectedEncontro) {
        const encontroLabel = encontrosOptions.find(
          (d) => d.value === selectedEncontro
        )?.label;
        doc.text(`Encontro: ${encontroLabel}`, 20, 45);
      }

      // Estatísticas
      doc.setFontSize(14);
      doc.text("Resumo:", 20, 60);
      doc.setFontSize(12);
      doc.text(`Total de inscrições: ${inscricoesFiltradas.length}`, 25, 75);
      doc.text(
        `Primeira vez: ${
          inscricoesFiltradas.filter(
            (i: any) => i.typeOfParticipation === "firstTime"
          ).length
        }`,
        25,
        85
      );
      doc.text(
        `Veteranos: ${
          inscricoesFiltradas.filter(
            (i: any) => i.typeOfParticipation === "returning"
          ).length
        }`,
        25,
        95
      );
      doc.text(
        `Liderança: ${
          inscricoesFiltradas.filter(
            (i: any) => i.typeOfParticipation === "leadership"
          ).length
        }`,
        25,
        105
      );

      // Lista de pessoas
      doc.setFontSize(14);
      doc.text("Lista de Inscritos:", 20, 125);

      let yPosition = 140;
      doc.setFontSize(10);

      inscricoesFiltradas.forEach((person: any, index: number) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.text(`${index + 1}. ${person.name}`, 25, yPosition);
        doc.text(`Email: ${person.email}`, 30, yPosition + 8);
        doc.text(
          `Telefone: ${formatPhoneNumber(person.phoneNumber)}`,
          30,
          yPosition + 16
        );
        doc.text(`Idade: ${person.age} anos`, 30, yPosition + 24);
        doc.text(
          `Endereço: ${person.address || "Não informado"}`,
          30,
          yPosition + 32
        );
        doc.text(
          `Tipo: ${getTipoParticipacaoLabel(person.typeOfParticipation)}`,
          30,
          yPosition + 40
        );
        if (person.observations) {
          doc.text(`Observações: ${person.observations}`, 30, yPosition + 48);
        }

        yPosition += person.observations ? 60 : 52;
      });

      // Salvar o PDF
      const fileName = selectedEncontro
        ? `encontro-${selectedEncontro}-inscricoes.pdf`
        : `encontro-todas-inscricoes.pdf`;
      doc.save(fileName);
    } catch (error) {
      // console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Verifique o console para mais detalhes.");
    }
  };

  const rows = inscricoesFiltradas.map((inscricao) => (
    <Table.Tr key={inscricao.id}>
      <Table.Td>
        <Stack gap={4}>
          <Text fw={600} size="sm">
            {inscricao.name}
          </Text>
          <Group gap={4}>
            <IconMail size={12} color="gray" />
            <Text size="xs" c="dimmed">
              {inscricao.email}
            </Text>
          </Group>
        </Stack>
      </Table.Td>
      <Table.Td visibleFrom="sm">
        <Group gap={4}>
          <IconPhone size={12} color="gray" />
          <Text size="sm">{useFormattedPhone(inscricao.phoneNumber)}</Text>
        </Group>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Text size="sm">{inscricao.age} anos</Text>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Group gap={4}>
          <IconMapPin size={12} color="gray" />
          <Text size="sm">{inscricao.address}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge
          color={getTipoParticipacaoColor(inscricao.typeOfParticipation)}
          variant="light"
          size="sm"
        >
          {getTipoParticipacaoLabel(inscricao.typeOfParticipation)}
        </Badge>
      </Table.Td>
      <Table.Td visibleFrom="sm">
        <Text size="sm" c="dimmed">
          {(() => {
            const date =
              inscricao.createdAt instanceof Date
                ? inscricao.createdAt
                : inscricao.createdAt?.toDate?.() || new Date();
            return date.toLocaleDateString("pt-BR");
          })()}
        </Text>
      </Table.Td>
      <Table.Td>
        <Tooltip label="Ver detalhes">
          <ActionIcon
            variant="subtle"
            color="violet"
            size="sm"
            onClick={() => handleVerDetalhes(inscricao)}
          >
            <IconEye size={16} />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      <Stack gap="md" mb="xl">
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="md">
            <Button
              component={Link}
              href="/dashboard"
              variant="light"
              color="violet"
              size="sm"
              leftSection={<IconArrowLeft size={16} />}
            >
              Voltar
            </Button>
            <Title order={1} c="violet.6" visibleFrom="sm">
              Interessados no Encontro com Deus
            </Title>
            <Title order={3} c="violet.6" hiddenFrom="sm">
              Interessados no Encontro
            </Title>
          </Group>

          <Button
            leftSection={<IconDownload size={16} />}
            variant="outline"
            color="violet"
            size="sm"
            onClick={handleExportar}
          >
            Exportar
          </Button>
        </Group>

        {/* Filtro por Data do Encontro */}
        <Paper withBorder p="md" bg={isDark ? "dark.6" : "white"}>
          <Group justify="space-between" mb="sm">
            <Text size="sm" fw={500}>
              Filtros
            </Text>
            {selectedEncontro && (
              <Badge color="blue" variant="light" size="sm">
                Filtro ativo
              </Badge>
            )}
          </Group>
          <Group align="end" gap="md">
            <Select
              label="Filtrar por Data do Encontro"
              placeholder="Todas as datas"
              data={encontrosOptions}
              value={selectedEncontro}
              onChange={setSelectedEncontro}
              clearable
              style={{ minWidth: 250 }}
            />
            {selectedEncontro && (
              <Text size="sm" c="dimmed">
                Exibindo {inscricoesFiltradas.length} inscriç
                {inscricoesFiltradas.length !== 1 ? "ões" : "ão"}
                {selectedEncontro &&
                  ` para ${
                    encontrosOptions.find((d) => d.value === selectedEncontro)
                      ?.label
                  }`}
                <Text span c="blue.6" fw={500}>
                  (de {participants.length} total)
                </Text>
              </Text>
            )}
            {!selectedEncontro && participants.length > 0 && (
              <Text size="sm" c="dimmed">
                Mostrando todas as {participants.length} inscrições
              </Text>
            )}
          </Group>
        </Paper>
      </Stack>

      {/* Cards de Resumo */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} mb="xl">
        <Card withBorder p="md" bg={isDark ? "dark.6" : "white"}>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={600}>
              Total
            </Text>
            <Text size="lg" fw={700} c="violet.6">
              {inscricoesFiltradas.length}
            </Text>
          </Stack>
        </Card>

        <Card withBorder p="md" bg={isDark ? "dark.6" : "white"}>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={600}>
              Primeira Vez
            </Text>
            <Text size="lg" fw={700} c="blue.6">
              {
                inscricoesFiltradas.filter(
                  (i) => i.typeOfParticipation === "firstTime"
                ).length
              }
            </Text>
          </Stack>
        </Card>

        <Card withBorder p="md" bg={isDark ? "dark.6" : "white"}>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={600}>
              Veteranos
            </Text>
            <Text size="lg" fw={700} c="green.6">
              {
                inscricoesFiltradas.filter(
                  (i) => i.typeOfParticipation === "returning"
                ).length
              }
            </Text>
          </Stack>
        </Card>

        <Card withBorder p="md" bg={isDark ? "dark.6" : "white"}>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={600}>
              Liderança
            </Text>
            <Text size="lg" fw={700} c="violet.6">
              {
                inscricoesFiltradas.filter(
                  (i) => i.typeOfParticipation === "leadership"
                ).length
              }
            </Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Tabela de Inscrições */}
      <Paper withBorder p="md" bg={isDark ? "dark.6" : "white"}>
        <Title order={3} mb="md" c={isDark ? "white" : "dark"}>
          Lista de Inscritos
        </Title>

        <Box style={{ overflowX: "auto" }}>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome / Email</Table.Th>
                <Table.Th visibleFrom="sm">Telefone</Table.Th>
                <Table.Th visibleFrom="md">Idade</Table.Th>
                <Table.Th visibleFrom="md">Endereço</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th visibleFrom="sm">Data Inscrição</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Box>

        {inscricoesFiltradas.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            {selectedEncontro
              ? "Nenhuma inscrição encontrada para esta data de encontro"
              : "Nenhuma inscrição encontrada"}
          </Text>
        )}
      </Paper>

      {/* Modal de Detalhes */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Group gap="sm">
            <IconUser size={20} />
            <Text fw={600}>Detalhes da Inscrição</Text>
          </Group>
        }
        size="md"
        centered
      >
        {selectedPerson && (
          <Stack gap="md">
            <Paper withBorder p="md" bg={isDark ? "dark.7" : "gray.0"}>
              <Stack gap="sm">
                <Group justify="space-between" align="start">
                  <Box>
                    <Text size="xl" fw={700} c={isDark ? "white" : "dark"}>
                      {selectedPerson.name}
                    </Text>
                    <Badge
                      color={getTipoParticipacaoColor(
                        selectedPerson.typeOfParticipation
                      )}
                      variant="light"
                      size="md"
                      mt="xs"
                    >
                      {getTipoParticipacaoLabel(
                        selectedPerson.typeOfParticipation
                      )}
                    </Badge>
                  </Box>
                  <Text size="sm" c="dimmed">
                    {selectedPerson.age} anos
                  </Text>
                </Group>
              </Stack>
            </Paper>

            <Divider />

            <Stack gap="md">
              <Group gap="sm">
                <IconMail size={18} color="gray" />
                <Box>
                  <Text size="sm" c="dimmed" fw={500}>
                    Email
                  </Text>
                  <Text size="sm">{selectedPerson.email}</Text>
                </Box>
              </Group>

              <Group gap="sm">
                <IconPhone size={18} color="gray" />
                <Box>
                  <Text size="sm" c="dimmed" fw={500}>
                    Telefone
                  </Text>
                  <Text size="sm">
                    {useFormattedPhone(selectedPerson.phoneNumber)}
                  </Text>
                </Box>
              </Group>

              <Group gap="sm">
                <IconMapPin size={18} color="gray" />
                <Box>
                  <Text size="sm" c="dimmed" fw={500}>
                    Endereço
                  </Text>
                  <Text size="sm">{selectedPerson.address}</Text>
                </Box>
              </Group>

              <Group gap="sm">
                <IconCalendar size={18} color="gray" />
                <Box>
                  <Text size="sm" c="dimmed" fw={500}>
                    Data de Inscrição
                  </Text>
                  <Text size="sm">
                    {(() => {
                      const date =
                        selectedPerson.createdAt instanceof Date
                          ? selectedPerson.createdAt
                          : selectedPerson.createdAt?.toDate?.() || new Date();
                      return date.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      });
                    })()}
                  </Text>
                </Box>
              </Group>

              <Group gap="sm">
                <IconCalendar size={18} color="gray" />
                <Box>
                  <Text size="sm" c="dimmed" fw={500}>
                    Data da Inscrição
                  </Text>
                  <Text size="sm">
                    {(() => {
                      const date =
                        selectedPerson.createdAt instanceof Date
                          ? selectedPerson.createdAt
                          : selectedPerson.createdAt?.toDate?.() || new Date();
                      return date.toLocaleDateString("pt-BR");
                    })()}
                  </Text>
                </Box>
              </Group>

              {selectedPerson.observations && (
                <>
                  <Divider />
                  <Group gap="sm" align="start">
                    <IconNotes size={18} color="gray" />
                    <Box>
                      <Text size="sm" c="dimmed" fw={500}>
                        Observações
                      </Text>
                      <Text size="sm">{selectedPerson.observations}</Text>
                    </Box>
                  </Group>
                </>
              )}
            </Stack>

            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                color="gray"
                onClick={() => setModalOpened(false)}
              >
                Fechar
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
