import { showNotification } from "@mantine/notifications";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function useNotifySermonCreated() {
  const searchParams = useSearchParams();
  const created = searchParams.get("created");
  const updated = searchParams.get("updated");
  const hasNotified = useRef(false);

  useEffect(() => {
    if (created && !hasNotified.current) {
      showNotification({
        title: "Sucesso",
        message: "Sermão criado com sucesso!",
        color: "green",
      });

      hasNotified.current = true;

      // Limpar a query da URL
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [created]);

  useEffect(() => {
    if (updated && !hasNotified.current) {
      showNotification({
        title: "Sucesso",
        message: "Sermão atualizado com sucesso!",
        color: "violet",
      });

      hasNotified.current = true;

      // Limpar a query da URL
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [updated]);
}
