// app/dashboard/layout.tsx
"use client";

import {
  AppShell,
  Burger,
  Button,
  Container,
  Group,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconDashboard, IconHome, IconLogout } from "@tabler/icons-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const route = useRouter();

  const links = [
    { label: "Início", icon: <IconHome size={18} />, href: "/dashboard" },

    // Adicione mais aqui
  ];

  // Exemplo: botão de logout
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });
    route.replace("/login");
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Button
            component={Link}
            href="/dashboard"
            rightSection={<IconDashboard size={16} />}
            variant="subtle"
            color="dark"
            onClick={() => route.push("/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            href="/"
            leftSection={<IconLogout size={16} />}
            variant="subtle"
            color="dark"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Group>
      </AppShell.Header>
      <Container size={"lg"} px="md">
        <AppShell.Main>{children}</AppShell.Main>
      </Container>
    </AppShell>
  );
}
