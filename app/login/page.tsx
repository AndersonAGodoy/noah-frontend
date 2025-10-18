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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useClientColorScheme } from "../../lib/hooks/useClientColorScheme";
import { loginSchema, type LoginFormData } from "../../lib/schemas";
import { zodResolver } from "../../lib/utils/zodResolver";
import { authService } from "../../lib/firebase/services/authService";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { isDark } = useClientColorScheme();

  const icon = <IconInfoCircle size={16} />;

  const handleSubmit = async (values: LoginFormData) => {
    const { email, password } = values;

    setLoading(true);
    setError("");

    try {
      const userCredential = await authService.login(email, password);

      // Aguardar um pouco para garantir que o estado de auth foi atualizado
      if (userCredential.user) {
        // Usar replace em vez de push para evitar voltar para login
        router.replace("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao fazer login - verifique suas credenciais";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<LoginFormData>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
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
