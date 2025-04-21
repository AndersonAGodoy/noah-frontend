import { Card, Flex, Skeleton, Stack } from "@mantine/core";
import { motion } from "framer-motion";

export default function DashboardSkeleton() {
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
      <Stack>
        <Flex gap={"md"} align="center" justify="space-between">
          <Skeleton height={150} width="100%" radius="sm" />
          <Skeleton height={150} width="100%" radius="sm" />
          <Skeleton height={0} width="100%" radius="sm" />
        </Flex>
        <Skeleton height={30} width="15%" radius="sm" />
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} height={80} width="100%" radius="sm" />
        ))}
      </Stack>
    </motion.div>
  );
}
