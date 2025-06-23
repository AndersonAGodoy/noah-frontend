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

// Dados mockados para demonstração
const mockInscricoes = [
  {
    id: 1,
    nome: "Maria Silva",
    email: "maria.silva@email.com",
    telefone: "(11) 99999-1234",
    idade: 28,
    endereco: "São Paulo, SP",
    tipoParticipacao: "primeira-vez",
    observacoes: "Primeira vez participando, muito animada!",
    dataInscricao: "2025-06-20",
    dataEncontro: "2025-07-15",
  },
  {
    id: 2,
    nome: "João Santos",
    email: "joao.santos@email.com",
    telefone: "(11) 98888-5678",
    idade: 35,
    endereco: "Mauá, SP",
    tipoParticipacao: "ja-participei",
    observacoes: "Já participei duas vezes, amo o encontro!",
    dataInscricao: "2025-06-21",
    dataEncontro: "2025-07-15",
  },
  {
    id: 3,
    nome: "Ana Carolina",
    email: "ana.carolina@email.com",
    telefone: "(11) 97777-9012",
    idade: 42,
    endereco: "Santo André, SP",
    tipoParticipacao: "lideranca",
    observacoes: "Gostaria de ajudar na organização",
    dataInscricao: "2025-06-22",
    dataEncontro: "2025-08-20",
  },
  {
    id: 4,
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    telefone: "(11) 96666-3456",
    idade: 31,
    endereco: "São Bernardo, SP",
    tipoParticipacao: "primeira-vez",
    observacoes: "",
    dataInscricao: "2025-06-23",
    dataEncontro: "2025-08-20",
  },
  {
    id: 5,
    nome: "Fernanda Costa",
    email: "fernanda.costa@email.com",
    telefone: "(11) 95555-7890",
    idade: 26,
    endereco: "Diadema, SP",
    tipoParticipacao: "primeira-vez",
    observacoes: "Muito empolgada para participar!",
    dataInscricao: "2025-06-23",
    dataEncontro: "2025-09-10",
  },
  {
    id: 6,
    nome: "Carlos Mendes",
    email: "carlos.mendes@email.com",
    telefone: "(11) 94444-1122",
    idade: 38,
    endereco: "São Caetano, SP",
    tipoParticipacao: "lideranca",
    observacoes: "Disponível para liderar grupo",
    dataInscricao: "2025-06-23",
    dataEncontro: "2025-09-10",
  },
];

const getTipoParticipacaoColor = (tipo: string) => {
  switch (tipo) {
    case "primeira-vez":
      return "blue";
    case "ja-participei":
      return "green";
    case "lideranca":
      return "violet";
    default:
      return "gray";
  }
};

const getTipoParticipacaoLabel = (tipo: string) => {
  switch (tipo) {
    case "primeira-vez":
      return "Primeira vez";
    case "ja-participei":
      return "Já participei";
    case "lideranca":
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

  // Extrair datas únicas dos encontros
  const datasEncontros = useMemo(() => {
    const datas = Array.from(
      new Set(mockInscricoes.map((i) => i.dataEncontro))
    );
    return datas.map((data) => ({
      value: data,
      label: new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    }));
  }, []);

  // Filtrar inscrições baseado na data selecionada
  const inscricoesFiltradas = useMemo(() => {
    if (!selectedEncontro) return mockInscricoes;
    return mockInscricoes.filter((i) => i.dataEncontro === selectedEncontro);
  }, [selectedEncontro]);

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
        const encontroLabel = datasEncontros.find(
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
            (i: any) => i.tipoParticipacao === "primeira-vez"
          ).length
        }`,
        25,
        85
      );
      doc.text(
        `Veteranos: ${
          inscricoesFiltradas.filter(
            (i: any) => i.tipoParticipacao === "ja-participei"
          ).length
        }`,
        25,
        95
      );
      doc.text(
        `Liderança: ${
          inscricoesFiltradas.filter(
            (i: any) => i.tipoParticipacao === "lideranca"
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

        doc.text(`${index + 1}. ${person.nome}`, 25, yPosition);
        doc.text(`Email: ${person.email}`, 30, yPosition + 8);
        doc.text(`Telefone: ${person.telefone}`, 30, yPosition + 16);
        doc.text(`Idade: ${person.idade} anos`, 30, yPosition + 24);
        doc.text(`Endereço: ${person.endereco}`, 30, yPosition + 32);
        doc.text(
          `Tipo: ${getTipoParticipacaoLabel(person.tipoParticipacao)}`,
          30,
          yPosition + 40
        );
        if (person.observacoes) {
          doc.text(`Observações: ${person.observacoes}`, 30, yPosition + 48);
        }

        yPosition += person.observacoes ? 60 : 52;
      });

      // Salvar o PDF
      const fileName = selectedEncontro
        ? `encontro-${selectedEncontro}-inscricoes.pdf`
        : `encontro-todas-inscricoes.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Verifique o console para mais detalhes.");
    }
  };

  const rows = inscricoesFiltradas.map((inscricao) => (
    <Table.Tr key={inscricao.id}>
      <Table.Td>
        <Stack gap={4}>
          <Text fw={600} size="sm">
            {inscricao.nome}
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
          <Text size="sm">{inscricao.telefone}</Text>
        </Group>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Text size="sm">{inscricao.idade} anos</Text>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Group gap={4}>
          <IconMapPin size={12} color="gray" />
          <Text size="sm">{inscricao.endereco}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge
          color={getTipoParticipacaoColor(inscricao.tipoParticipacao)}
          variant="light"
          size="sm"
        >
          {getTipoParticipacaoLabel(inscricao.tipoParticipacao)}
        </Badge>
      </Table.Td>
      <Table.Td visibleFrom="sm">
        <Text size="sm" c="dimmed">
          {new Date(inscricao.dataInscricao).toLocaleDateString("pt-BR")}
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
          <Group align="end" gap="md">
            <Select
              label="Filtrar por Data do Encontro"
              placeholder="Todas as datas"
              data={datasEncontros}
              value={selectedEncontro}
              onChange={setSelectedEncontro}
              clearable
              style={{ minWidth: 250 }}
            />
            {selectedEncontro && (
              <Text size="sm" c="dimmed">
                Exibindo {inscricoesFiltradas.length} inscrição
                {inscricoesFiltradas.length !== 1 ? "ões" : ""}
                {selectedEncontro &&
                  ` para ${
                    datasEncontros.find((d) => d.value === selectedEncontro)
                      ?.label
                  }`}
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
                  (i) => i.tipoParticipacao === "primeira-vez"
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
                  (i) => i.tipoParticipacao === "ja-participei"
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
                  (i) => i.tipoParticipacao === "lideranca"
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
                      {selectedPerson.nome}
                    </Text>
                    <Badge
                      color={getTipoParticipacaoColor(
                        selectedPerson.tipoParticipacao
                      )}
                      variant="light"
                      size="md"
                      mt="xs"
                    >
                      {getTipoParticipacaoLabel(
                        selectedPerson.tipoParticipacao
                      )}
                    </Badge>
                  </Box>
                  <Text size="sm" c="dimmed">
                    {selectedPerson.idade} anos
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
                  <Text size="sm">{selectedPerson.telefone}</Text>
                </Box>
              </Group>

              <Group gap="sm">
                <IconMapPin size={18} color="gray" />
                <Box>
                  <Text size="sm" c="dimmed" fw={500}>
                    Endereço
                  </Text>
                  <Text size="sm">{selectedPerson.endereco}</Text>
                </Box>
              </Group>

              <Group gap="sm">
                <IconCalendar size={18} color="gray" />
                <Box>
                  <Text size="sm" c="dimmed" fw={500}>
                    Data do Encontro
                  </Text>
                  <Text size="sm">
                    {new Date(selectedPerson.dataEncontro).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
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
                    {new Date(selectedPerson.dataInscricao).toLocaleDateString(
                      "pt-BR"
                    )}
                  </Text>
                </Box>
              </Group>

              {selectedPerson.observacoes && (
                <>
                  <Divider />
                  <Group gap="sm" align="start">
                    <IconNotes size={18} color="gray" />
                    <Box>
                      <Text size="sm" c="dimmed" fw={500}>
                        Observações
                      </Text>
                      <Text size="sm">{selectedPerson.observacoes}</Text>
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
