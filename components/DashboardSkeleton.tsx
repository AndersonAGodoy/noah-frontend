import { Flex, Skeleton, Stack, useMantineTheme } from "@mantine/core";

export default function DashboardSkeleton() {
  return (
    <Stack gap="md">
      <Flex
        gap="md"
        align="center"
        justify="space-between"
        direction={{ base: "column", sm: "row" }}
      >
        <Skeleton h={150} flex={{ base: 1, sm: 0.3 }} radius="sm" />
        <Skeleton h={150} flex={{ base: 1, sm: 0.3 }} radius="sm" />
        <Skeleton h={150} flex={{ base: 1, sm: 0.3 }} radius="sm" />
      </Flex>

      <Skeleton h={30} w={{ base: "40%", sm: "15%" }} radius="sm" />

      <Stack gap="sm">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} h={{ base: 60, sm: 80 }} w="100%" radius="sm" />
        ))}
      </Stack>
    </Stack>
  );
}
