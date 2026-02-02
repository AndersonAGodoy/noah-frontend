import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import { IconWifiOff } from "@tabler/icons-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <Container
      size="sm"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack align="center" gap="xl">
        <ThemeIcon size={120} radius="xl" variant="light" color="gray">
          <IconWifiOff size={60} />
        </ThemeIcon>

        <Stack align="center" gap="xs">
          <Title order={1} ta="center">
            Você está offline
          </Title>
          <Text ta="center" c="dimmed" size="lg">
            Parece que você perdeu a conexão com a internet.
          </Text>
          <Text ta="center" c="dimmed" size="sm">
            Verifique sua conexão e tente novamente.
          </Text>
        </Stack>

        <Button
          component={Link}
          href="/"
          size="md"
          onClick={() => window.location.reload()}
        >
          Tentar Novamente
        </Button>
      </Stack>
    </Container>
  );
}
