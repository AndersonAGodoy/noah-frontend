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
import { useClientColorScheme } from "../../lib/hooks/useClientColorScheme";
import ThemeToggle from "../../components/ThemeToggle";
import { authService } from "../../lib/firebase/services/authService";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase/config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const route = useRouter();
  const { isDark } = useClientColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar autenticação com Firebase Auth
  // Esta é a FORMA CORRETA de proteger rotas com Firebase Auth
  // Firebase armazena tokens no cliente (localStorage), não em cookies do servidor
  // Por isso a verificação acontece aqui no componente cliente, não no middleware
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        route.replace("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [route]);

  const links = [
    { label: "Início", icon: <IconHome size={18} />, href: "/dashboard" },

    // Adicione mais aqui
  ];

  // Logout usando Firebase Auth
  const handleLogout = async () => {
    try {
      await authService.logout();
      route.replace("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado, o useEffect já redirecionou
  if (!isAuthenticated) {
    return null;
  }
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
            color={isDark ? "gray" : "dark"}
            onClick={() => route.push("/dashboard")}
          >
            Dashboard
          </Button>
          <Group gap="sm">
            <ThemeToggle />
            <Button
              component={Link}
              href="/"
              leftSection={<IconLogout size={16} />}
              variant="subtle"
              color={isDark ? "gray" : "dark"}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Group>
        </Group>
      </AppShell.Header>
      <Container size={"lg"} px="md">
        <AppShell.Main>{children}</AppShell.Main>
      </Container>
    </AppShell>
  );
}
