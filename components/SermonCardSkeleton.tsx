import { Card, Flex, Skeleton, Stack } from "@mantine/core";

export default function SermonCardSkeleton() {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      w="100%"
      h="auto"
      miw={0}
    >
      <Stack>
        <Skeleton height={200} width="100%" radius="sm" />
        <Skeleton height={20} width="50%" radius="sm" />
        <Skeleton height={10} width="90%" radius="sm" />
        <Skeleton height={10} width="40%" radius="sm" />
        <Skeleton height={10} width="60%" radius="sm" />
        <Flex gap={8} align="center" justify="space-between">
          <Skeleton height={10} width="30%" radius="sm" />
          <Skeleton height={10} width="30%" radius="sm" />
          <Skeleton height={10} width="30%" radius="sm" />
        </Flex>
      </Stack>
    </Card>
  );
}
