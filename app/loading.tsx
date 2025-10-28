import { Container, Skeleton, Stack, Group, SimpleGrid } from "@mantine/core";

export default function Loading() {
    return (
        <Container size="xl" py="3rem">
            {/* Hero Section Skeleton */}
            <Stack align="center" gap="xl" mb="3rem">
                <Skeleton height={60} width="80%" radius="md" />
                <Skeleton height={30} width="60%" radius="md" />
                <Skeleton height={20} width="40%" radius="md" />
            </Stack>

            {/* Filter Skeleton */}
            <Group justify="center" mb="2rem">
                <Skeleton height={40} width={250} radius="xl" />
            </Group>

            {/* Sermons Grid Skeleton */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} height={400} radius="md" />
                ))}
            </SimpleGrid>
        </Container>
    );
}
