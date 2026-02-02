"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  List,
  Button,
  Group,
  Box,
} from "@mantine/core";
import {
  IconShieldCheck,
  IconLock,
  IconDatabase,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function PoliticaPrivacidadePage() {
  const router = useRouter();

  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
        minHeight: "100vh",
      }}
    >
      <Container size="md" py={40}>
        <Stack gap={24}>
          {/* Botão Voltar */}
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => router.replace("/")}
            color="violet"
            w="fit-content"
          >
            Voltar
          </Button>

          {/* Header */}
          <Box>
            <Title order={1} style={{ marginBottom: 8, color: "#7c3aed" }}>
              Política de Privacidade
            </Title>
            <Text c="dimmed" size="sm">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </Text>
          </Box>

          {/* Introdução */}
          <Paper p="xl" withBorder shadow="sm" radius="md" bg="white">
            <Stack gap={16}>
              <Group gap={12}>
                <IconShieldCheck size={28} color="#7c3aed" />
                <Title order={2} c="violet">
                  Introdução
                </Title>
              </Group>
              <Text>
                A plataforma <strong>No'ah</strong> está comprometida com a
                proteção da sua privacidade e o tratamento adequado dos seus
                dados pessoais, em conformidade com a Lei Geral de Proteção de
                Dados (LGPD - Lei nº 13.709/2018).
              </Text>
              <Text>
                Esta política descreve como coletamos, usamos, armazenamos e
                protegemos suas informações quando você utiliza nosso
                Progressive Web App (PWA).
              </Text>
            </Stack>
          </Paper>

          {/* Dados Coletados */}
          <Paper p="xl" withBorder shadow="sm" radius="md" bg="white">
            <Stack gap={16}>
              <Group gap={12}>
                <IconDatabase size={28} color="#7c3aed" />
                <Title order={2} c="violet">
                  Dados Coletados
                </Title>
              </Group>

              <Title order={3} size="h4">
                1. Dados de Notificação Push
              </Title>
              <Text>Quando você aceita receber notificações, coletamos:</Text>
              <List size="sm" spacing="xs">
                <List.Item>
                  <strong>Token FCM (Firebase Cloud Messaging):</strong>{" "}
                  Identificador único do dispositivo para envio de notificações
                </List.Item>
                <List.Item>
                  <strong>Informações do navegador:</strong> Nome e versão do
                  navegador
                </List.Item>
                <List.Item>
                  <strong>Sistema operacional:</strong> Tipo e versão do sistema
                </List.Item>
                <List.Item>
                  <strong>Data de instalação:</strong> Quando você instalou o
                  PWA
                </List.Item>
                <List.Item>
                  <strong>Última atividade:</strong> Data do último acesso
                  registrado
                </List.Item>
              </List>

              <Title order={3} size="h4" style={{ marginTop: 16 }}>
                2. Dados de Navegação
              </Title>
              <List size="sm" spacing="xs">
                <List.Item>Páginas visitadas no aplicativo</List.Item>
                <List.Item>Tempo de permanência nas páginas</List.Item>
                <List.Item>
                  Interações com o conteúdo (via Google Analytics)
                </List.Item>
              </List>

              <Title order={3} size="h4" style={{ marginTop: 16 }}>
                3. Dados de Autenticação (apenas administradores)
              </Title>
              <List size="sm" spacing="xs">
                <List.Item>E-mail</List.Item>
                <List.Item>Nome de usuário</List.Item>
                <List.Item>Dados de sessão</List.Item>
              </List>
            </Stack>
          </Paper>

          {/* Finalidade */}
          <Paper p="xl" withBorder shadow="sm" radius="md" bg="white">
            <Stack gap={16}>
              <Title order={2} c="violet">
                Finalidade do Tratamento
              </Title>
              <Text>Utilizamos seus dados para:</Text>
              <List size="sm" spacing="xs">
                <List.Item>
                  <strong>Enviar notificações:</strong> Informar sobre novos
                  sermões, eventos e conteúdos relevantes
                </List.Item>
                <List.Item>
                  <strong>Melhorar a experiência:</strong> Análise de uso para
                  aprimoramento da plataforma
                </List.Item>
                <List.Item>
                  <strong>Estatísticas:</strong> Entender quantas pessoas
                  instalaram o app e quais conteúdos são mais acessados
                </List.Item>
                <List.Item>
                  <strong>Segurança:</strong> Proteção contra uso indevido da
                  plataforma
                </List.Item>
              </List>
            </Stack>
          </Paper>

          {/* Compartilhamento */}
          <Paper p="xl" withBorder shadow="sm" radius="md" bg="white">
            <Stack gap={16}>
              <Title order={2} c="violet">
                Compartilhamento de Dados
              </Title>
              <Text>
                <strong>Não vendemos seus dados.</strong> Seus dados são
                compartilhados apenas com:
              </Text>
              <List size="sm" spacing="xs">
                <List.Item>
                  <strong>Firebase (Google):</strong> Infraestrutura de banco de
                  dados, autenticação e notificações push
                </List.Item>
                <List.Item>
                  <strong>Google Analytics:</strong> Análise anônima de uso da
                  plataforma
                </List.Item>
              </List>
              <Text size="sm" c="dimmed" style={{ marginTop: 8 }}>
                Estes serviços possuem suas próprias políticas de privacidade e
                seguem padrões internacionais de proteção de dados.
              </Text>
            </Stack>
          </Paper>

          {/* Armazenamento */}
          <Paper p="xl" withBorder shadow="sm" radius="md" bg="white">
            <Stack gap={16}>
              <Group gap={12}>
                <IconLock size={28} color="#7c3aed" />
                <Title order={2} c="violet">
                  Armazenamento e Segurança
                </Title>
              </Group>
              <List size="sm" spacing="xs">
                <List.Item>
                  <strong>Localização:</strong> Dados armazenados em servidores
                  Firebase (Google Cloud) com redundância e backup
                </List.Item>
                <List.Item>
                  <strong>Criptografia:</strong> Dados transmitidos via
                  HTTPS/TLS
                </List.Item>
                <List.Item>
                  <strong>Retenção:</strong> Tokens inativos por mais de 90 dias
                  são automaticamente removidos
                </List.Item>
                <List.Item>
                  <strong>Acesso:</strong> Apenas administradores autorizados
                  podem acessar dados de métricas agregadas
                </List.Item>
              </List>
            </Stack>
          </Paper>

          {/* Seus Direitos */}
          <Paper p="xl" withBorder shadow="sm" radius="md" bg="white">
            <Stack gap={16}>
              <Title order={2} c="violet">
                Seus Direitos (LGPD)
              </Title>
              <Text>Você tem direito a:</Text>
              <List size="sm" spacing="xs">
                <List.Item>
                  <strong>Acesso:</strong> Solicitar quais dados pessoais temos
                  sobre você
                </List.Item>
                <List.Item>
                  <strong>Retificação:</strong> Corrigir dados incompletos ou
                  desatualizados
                </List.Item>
                <List.Item>
                  <strong>Exclusão:</strong> Solicitar a remoção dos seus dados
                </List.Item>
                <List.Item>
                  <strong>Revogação:</strong> Retirar o consentimento para
                  notificações a qualquer momento
                </List.Item>
                <List.Item>
                  <strong>Portabilidade:</strong> Solicitar seus dados em
                  formato estruturado
                </List.Item>
                <List.Item>
                  <strong>Oposição:</strong> Opor-se ao tratamento dos seus
                  dados
                </List.Item>
              </List>

              <Title order={3} size="h4" style={{ marginTop: 16 }}>
                Como exercer seus direitos?
              </Title>
              <Text size="sm">Para desativar notificações:</Text>
              <List size="sm" spacing="xs">
                <List.Item>
                  Acesse as configurações do navegador → Privacidade e Segurança
                  → Notificações
                </List.Item>
                <List.Item>
                  Ou desinstale o PWA removendo-o da tela inicial/apps
                </List.Item>
              </List>
              <Text size="sm" style={{ marginTop: 16 }}>
                Para solicitar exclusão completa dos dados ou tirar dúvidas,
                entre em contato através dos canais da igreja.
              </Text>
            </Stack>
          </Paper>

          {/* Cookies */}
          <Paper p="xl" withBorder shadow="sm" radius="md" bg="white">
            <Stack gap={16}>
              <Title order={2} c="violet">
                Cookies e Armazenamento Local
              </Title>
              <Text>Utilizamos:</Text>
              <List size="sm" spacing="xs">
                <List.Item>
                  <strong>localStorage:</strong> Para armazenar preferências
                  como tema (claro/escuro) e consentimento de notificações
                </List.Item>
                <List.Item>
                  <strong>Session cookies:</strong> Para manter administradores
                  autenticados
                </List.Item>
                <List.Item>
                  <strong>Google Analytics cookies:</strong> Para análise de uso
                  (pode ser bloqueado via extensões de navegador)
                </List.Item>
              </List>
            </Stack>
          </Paper>

          {/* Alterações */}
          <Paper p="xl" withBorder shadow="sm" radius="md" bg="white">
            <Stack gap={16}>
              <Title order={2} c="violet">
                Alterações nesta Política
              </Title>
              <Text>
                Esta política pode ser atualizada periodicamente. Alterações
                significativas serão comunicadas através de notificação no
                aplicativo ou e-mail (para administradores).
              </Text>
              <Text size="sm" c="dimmed">
                Data da última atualização:{" "}
                {new Date().toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </Stack>
          </Paper>

          {/* Contato */}
          <Paper p="xl" withBorder shadow="sm" radius="md" bg="white">
            <Stack gap={16}>
              <Title order={2} c="violet">
                Contato
              </Title>
              <Text>
                Se você tiver dúvidas sobre esta Política de Privacidade ou
                sobre o tratamento dos seus dados pessoais, entre em contato
                através dos canais oficiais da igreja.
              </Text>
              <Text size="sm" style={{ marginTop: 16 }} fw={600}>
                Plataforma No'ah - Sistema de Gerenciamento de Sermões
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
