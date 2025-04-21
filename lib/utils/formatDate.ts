export default function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  // Verifique se a data é válida
  if (isNaN(date.getTime())) {
    return ""; // Retorna uma mensagem de erro caso a data seja inválida
  }

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Verifique se diffDays é um número válido
  if (!isFinite(diffDays)) {
    return "Erro no cálculo da data"; // Caso o cálculo não seja válido
  }

  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  return rtf.format(-diffDays, "day");
}
