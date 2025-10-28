import { Container, Skeleton, Stack, Paper, Group } from "@mantine/core";

export default function SermonLoading() {
    return (
        <Container size="lg" py="3rem">
            {/* Header Skeleton */}
            <Stack gap="md" mb="xl">
                <Group gap="sm">
                    <Skeleton height={32} width={120} radius="md" />
                </Group>
                <Skeleton height={60} width="100%" radius="md" />
                <Skeleton height={30} width="80%" radius="md" />
            </Stack>

            {/* Metadata Cards Skeleton */}
            <Group gap="lg" mb="2rem">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Paper key={index} p="md" radius="md" withBorder style={{ flex: 1 }}>
                        <Skeleton height={60} radius="md" />
                    </Paper>
                ))}
            </Group>

            {/* Content Skeleton */}
            <Stack gap="md">
                <Skeleton height={200} radius="md" />
                <Skeleton height={150} radius="md" />
                <Skeleton height={180} radius="md" />
            </Stack>
        </Container>
    );
}
