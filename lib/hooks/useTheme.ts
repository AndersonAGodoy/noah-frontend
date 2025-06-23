"use client";

import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { MantineColorScheme } from "@mantine/core";

export function useTheme() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<MantineColorScheme>({
    key: "noah-color-scheme",
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const isDark = colorScheme === "dark";

  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    isDark,
  };
}
