"use client";
import {
  Alert,
  Button,
  Card,
  Flex,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useClientColorScheme } from "../../lib/hooks/useClientColorScheme";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { isDark } = useClientColorScheme();

  const icon = <IconInfoCircle size={16} />;

  const handleSubmit = async (values: typeof form.values) => {
    const { email, password } = values;

    setLoading(true);
    setError("");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      Cookies.set("token", data["access_token"], {
        expires: 1,
      });

      router.push("/dashboard");
    } else {
      setError("Erro ao fazer login - verifique suas credenciais");
    }

    setLoading(false);
  };

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "E-mail inválido"),
      password: (value) => (value.length < 6 ? "Mínimo 6 caracteres" : null),
    },
  });
  return (
    <Flex
      justify={"center"}
      align="center"
      style={{
        height: "100vh",
        backgroundColor: isDark
          ? "var(--mantine-color-dark-8)"
          : "var(--mantine-color-gray-0)",
      }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        bg={isDark ? "dark.6" : "white"}
      >
        <Title order={2} mb="md" ta="center">
          Bem vindo de volta!👋
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          Entre com seu email e senha para acessar o sistema
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder=""
            required
            key={form.key("email")}
            {...form.getInputProps("email")}
            mb="md"
            type="email"
            name="email"
            autoComplete="email"
          />
          <TextInput
            label="Senha"
            placeholder=""
            required
            key={form.key("password")}
            {...form.getInputProps("password")}
            mb="md"
            type="password"
            name="password"
            autoComplete="current-password"
          />
          {error && (
            <Alert
              variant="light"
              color="red"
              title="Acesso negado"
              mb={"md"}
              icon={icon}
            >
              verifique suas credenciais e tente novamente
            </Alert>
          )}
          <Button type="submit" fullWidth bg={"violet"} loading={loading}>
            {" "}
            Entrar
          </Button>
        </form>
      </Card>
    </Flex>
  );
}
