"use client";

import { useMantineColorScheme } from "@mantine/core";
import { useIsomorphicEffect } from "@mantine/hooks";
import { useState } from "react";

export function useClientColorScheme() {
  const [mounted, setMounted] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  useIsomorphicEffect(() => {
    setMounted(true);
  }, []);

  // Durante a hidratação, sempre retorna light para evitar mismatch
  return {
    colorScheme: mounted ? colorScheme : "light",
    isDark: mounted ? colorScheme === "dark" : false,
    mounted,
  };
}
