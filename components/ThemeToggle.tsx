"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useState, useEffect } from "react";

interface ThemeToggleProps {
  size?: number;
  color?: string;
}

export default function ThemeToggle({ size = 24, color }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = mounted ? colorScheme === "dark" : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evita flash durante hidratação
  if (!mounted) {
    return (
      <ActionIcon
        variant="subtle"
        size="lg"
        aria-label="Toggle theme"
        color={color}
        style={{
          color: color || "var(--mantine-color-gray-6)",
        }}
      >
        <IconMoon size={size} />
      </ActionIcon>
    );
  }

  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant="subtle"
      size="lg"
      aria-label="Toggle theme"
      color={color}
      style={{
        color: color || (isDark ? "white" : "var(--mantine-color-gray-6)"),
      }}
    >
      {isDark ? <IconSun size={size} /> : <IconMoon size={size} />}
    </ActionIcon>
  );
}
