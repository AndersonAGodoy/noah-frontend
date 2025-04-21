"use client";

import {
  ActionIcon,
  Box,
  Flex,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export default function Topbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Flex
      justify="space-between"
      align="center"
      px="md"
      py="sm"
      bg="var(--mantine-color-body)"
    >
      <Text fw={500}>Olá, Usuário!</Text>
      <ActionIcon variant="outline" onClick={() => toggleColorScheme()}>
        {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
      </ActionIcon>
    </Flex>
  );
}
