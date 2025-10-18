"use client";

import { useState } from "react";
import { useGetEncounters } from "../../../lib/hooks/useGetEncounters";
import { useGetActiveEncounter } from "../../../lib/hooks/useGetActiveEncounter";
import { useCreateEncounter } from "../../../lib/hooks/useCreateEncounter";
import { useSetActiveEncounter } from "../../../lib/hooks/useSetActiveEncounter";
import type {
  CreateEncounterData,
  Encounter,
} from "../../../lib/types/Encounter";
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Grid,
  Stack,
  TextInput,
  Textarea,
  Group,
  Badge,
  Alert,
  Loader,
  NumberInput,
} from "@mantine/core";
import {
  IconCalendar,
  IconMapPin,
  IconUsers,
  IconPlus,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";

export default function EncontrosPage() {
  const { data: encounters, isLoading: encountersLoading } = useGetEncounters();
  const { data: activeEncounter, isLoading: activeEncounterLoading } =
    useGetActiveEncounter();
  const createEncounter = useCreateEncounter();
  const setActiveEncounter = useSetActiveEncounter();

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const encounterData: CreateEncounterData = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        location: formData.location,
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : undefined,
        isActive: false, // Novos encontros começam inativos
      };

      await createEncounter.mutateAsync(encounterData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        maxParticipants: "",
      });
    } catch (error) {
      console.error("Erro ao criar encontro:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSetActive = async (encounterId: string) => {
    try {
      await setActiveEncounter.mutateAsync(encounterId);
    } catch (error) {
      console.error("Erro ao definir encontro ativo:", error);
    }
  };

  const formatDate = (date: Date | { toDate(): Date } | undefined) => {
    if (!date) return "Data não definida";

    const dateObj = date instanceof Date ? date : date.toDate();
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (encountersLoading || activeEncounterLoading) {
    return (
      <Container size="lg" py="xl">
        <div className="flex justify-center items-center py-16">
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Carregando informações dos encontros...</Text>
          </Stack>
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1} mb="xs">
            <Group gap="sm">
              <IconCalendar size={32} />
              Gerenciar Encontros
            </Group>
          </Title>
          <Text c="dimmed" size="lg">
            Crie e gerencie os encontros com Deus da sua igreja
          </Text>
        </div>

        {/* Encontro Ativo */}
        {activeEncounter && (
          <Alert
            icon={<IconCheck size={16} />}
            title="Encontro Ativo"
            color="green"
            variant="light"
          >
            <Stack gap="xs">
              <Text fw={600}>{activeEncounter.title}</Text>
              <Group gap="md">
                <Group gap="xs">
                  <IconCalendar size={14} />
                  <Text size="sm">{formatDate(activeEncounter.startDate)}</Text>
                </Group>
                {activeEncounter.location && (
                  <Group gap="xs">
                    <IconMapPin size={14} />
                    <Text size="sm">{activeEncounter.location}</Text>
                  </Group>
                )}
              </Group>
            </Stack>
          </Alert>
        )}

        <Grid>
          {/* Formulário de Criação */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Group gap="sm" mb="md">
                  <IconPlus size={20} />
                  <Title order={3}>Criar Novo Encontro</Title>
                </Group>

                <form onSubmit={handleSubmit}>
                  <Stack gap="md">
                    <TextInput
                      label="Título"
                      placeholder="Ex: Encontro com Deus - Janeiro 2025"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />

                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          type="datetime-local"
                          label="Data/Hora de Início"
                          required
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              startDate: e.target.value,
                            }))
                          }
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          type="datetime-local"
                          label="Data/Hora de Fim"
                          required
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                        />
                      </Grid.Col>
                    </Grid>

                    <Grid>
                      <Grid.Col span={8}>
                        <TextInput
                          label="Local"
                          placeholder="Igreja, endereço, etc."
                          value={formData.location}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <NumberInput
                          label="Máx. Participantes"
                          placeholder="100"
                          min={1}
                          value={formData.maxParticipants}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              maxParticipants: value?.toString() || "",
                            }))
                          }
                        />
                      </Grid.Col>
                    </Grid>

                    <Textarea
                      label="Descrição"
                      placeholder="Informações adicionais sobre o encontro..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />

                    <Button
                      type="submit"
                      loading={isCreating}
                      leftSection={<IconPlus size={16} />}
                      fullWidth
                      size="md"
                    >
                      Criar Encontro
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Lista de Encontros */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Group gap="sm" mb="md">
                  <IconCalendar size={20} />
                  <Title order={3}>Encontros Existentes</Title>
                </Group>

                {encounters?.data?.length === 0 ? (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Nenhum encontro encontrado"
                    color="gray"
                    variant="light"
                  >
                    <Text size="sm">
                      Crie seu primeiro encontro usando o formulário ao lado.
                    </Text>
                  </Alert>
                ) : (
                  <Stack gap="md">
                    {encounters?.data?.map((encounter: Encounter) => (
                      <Card
                        key={encounter.id}
                        padding="md"
                        radius="sm"
                        withBorder
                      >
                        <Stack gap="sm">
                          <Group justify="space-between" align="flex-start">
                            <div>
                              <Group gap="xs" mb="xs">
                                <Text fw={600} size="sm">
                                  {encounter.title}
                                </Text>
                                <Badge
                                  color={encounter.isActive ? "green" : "gray"}
                                  size="xs"
                                  variant="light"
                                >
                                  {encounter.isActive ? "Ativo" : "Inativo"}
                                </Badge>
                              </Group>

                              {encounter.description && (
                                <Text size="xs" c="dimmed" mb="xs">
                                  {encounter.description}
                                </Text>
                              )}

                              <Stack gap={4}>
                                <Group gap="xs">
                                  <IconCalendar size={12} />
                                  <Text size="xs" c="dimmed">
                                    {formatDate(encounter.startDate)} -{" "}
                                    {formatDate(encounter.endDate)}
                                  </Text>
                                </Group>

                                {encounter.location && (
                                  <Group gap="xs">
                                    <IconMapPin size={12} />
                                    <Text size="xs" c="dimmed">
                                      {encounter.location}
                                    </Text>
                                  </Group>
                                )}

                                {encounter.maxParticipants && (
                                  <Group gap="xs">
                                    <IconUsers size={12} />
                                    <Text size="xs" c="dimmed">
                                      Máx. {encounter.maxParticipants}{" "}
                                      participantes
                                    </Text>
                                  </Group>
                                )}
                              </Stack>
                            </div>

                            {!encounter.isActive && (
                              <Button
                                size="xs"
                                variant="light"
                                onClick={() => handleSetActive(encounter.id)}
                                loading={setActiveEncounter.isPending}
                              >
                                Ativar
                              </Button>
                            )}
                          </Group>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
