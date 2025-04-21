import { Card, Flex, Skeleton, Stack } from "@mantine/core";
import { motion } from "framer-motion";

export default function SermonCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        w={400}
        h={400}
        miw={400}
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
    </motion.div>
  );
}
