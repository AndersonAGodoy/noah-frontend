"use client";

import { useEffect } from "react";
import { Container, Title, Text, Button, Stack, Paper } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        // console.error("Dashboard error:", error);
    }, [error]);

    return (
        <Container size="sm" py="xl">
            <Paper p="xl" radius="md" withBorder>
                <Stack align="center" gap="lg">
                    <IconAlertTriangle size={64} color="red" />
                    <Title order={1} ta="center">
                        Erro no Dashboard
                    </Title>
                    <Text size="lg" c="dimmed" ta="center">
                        Ocorreu um erro ao carregar os dados do dashboard.
                    </Text>
                    {process.env.NODE_ENV === "development" && (
                        <Text size="sm" c="red" ta="center" style={{ fontFamily: "monospace" }}>
                            {error.message}
                        </Text>
                    )}
                    <Stack gap="sm">
                        <Button onClick={reset} size="lg" variant="filled" color="violet">
                            Tentar novamente
                        </Button>
                        <Button
                            onClick={() => router.push("/")}
                            size="lg"
                            variant="outline"
                            color="violet"
                        >
                            Voltar para Início
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}
