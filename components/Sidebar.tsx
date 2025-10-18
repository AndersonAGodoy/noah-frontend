"use client";

import { Box, Stack, Anchor, Text } from "@mantine/core";
import {
  IconHome2,
  IconSettings,
  IconCalendarEvent,
} from "@tabler/icons-react";
import Link from "next/link";

function NavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <Anchor
      component={Link}
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 8,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Icon size={18} />
      <Text>{label}</Text>
    </Anchor>
  );
}

export default function Sidebar() {
  return (
    <Box
      w={220}
      h="100vh"
      p="md"
      style={{
        borderRight: "1px solid var(--mantine-color-gray-3)",
        position: "sticky",
        top: 0,
      }}
    >
      <Stack gap="sm">
        <NavItem href="/dashboard" icon={IconHome2} label="Início" />
        <NavItem
          href="/dashboard/encontros"
          icon={IconCalendarEvent}
          label="Encontros"
        />
        <NavItem
          href="/dashboard/settings"
          icon={IconSettings}
          label="Configurações"
        />
      </Stack>
    </Box>
  );
}
