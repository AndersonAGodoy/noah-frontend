"use client";

import { useEffect } from "react";
import { Container, Title, Text, Button, Stack, Paper } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log do erro para serviço de monitoramento
        console.error("Application error:", error);
    }, [error]);

    return (
        <Container size="sm" py="xl">
            <Paper p="xl" radius="md" withBorder>
                <Stack align="center" gap="lg">
                    <IconAlertTriangle size={64} color="red" />
                    <Title order={1} ta="center">
                        Algo deu errado!
                    </Title>
                    <Text size="lg" c="dimmed" ta="center">
                        Desculpe, ocorreu um erro inesperado. Tente novamente.
                    </Text>
                    {process.env.NODE_ENV === "development" && (
                        <Text size="sm" c="red" ta="center" style={{ fontFamily: "monospace" }}>
                            {error.message}
                        </Text>
                    )}
                    <Button onClick={reset} size="lg" variant="filled" color="violet">
                        Tentar novamente
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}
