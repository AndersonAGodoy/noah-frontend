import { Title, Text, Button, Container, Group } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container size="md" style={{ textAlign: "center", paddingTop: "5rem" }}>
      <Title order={1} c="violet" mb="md">
        404 - Sermão não encontrado
      </Title>
      <Text size="lg" c="dimmed" mb="xl">
        O sermão que você está procurando não existe ou não está mais
        disponível.
      </Text>
      <Group justify="center">
        <Button component={Link} href="/" variant="default" color="violet">
          Voltar para Home
        </Button>
      </Group>
    </Container>
  );
}
