export default function formatRelativeDate(dateStr: string): string {
  // Corrigir problema: strings YYYY-MM-DD são interpretadas como UTC
  // Se a string não tem horário, assumir que é local
  let date: Date;

  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Se é formato YYYY-MM-DD (sem horário), criar data local
    const [year, month, day] = dateStr.split("-").map(Number);
    date = new Date(year, month - 1, day); // mês é 0-indexed
  } else {
    // Se tem horário ou é ISO string, usar normalmente
    date = new Date(dateStr);
  }

  const now = new Date();

  // Verifique se a data é válida
  if (isNaN(date.getTime())) {
    return ""; // Retorna uma mensagem de erro caso a data seja inválida
  }

  // Comparar usando datas locais (não UTC) para evitar problemas de timezone
  // Extrair apenas ano, mês e dia do timezone local
  const dateLocal = {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };

  const nowLocal = {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
  };

  // Se é o mesmo ano, mês e dia local, é hoje
  if (
    dateLocal.year === nowLocal.year &&
    dateLocal.month === nowLocal.month &&
    dateLocal.day === nowLocal.day
  ) {
    return "hoje";
  }

  // Calcular diferença em dias usando apenas as datas locais (sem horário)
  const dateOnly = new Date(dateLocal.year, dateLocal.month, dateLocal.day);
  const nowOnly = new Date(nowLocal.year, nowLocal.month, nowLocal.day);

  const diffMs = nowOnly.getTime() - dateOnly.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Verifique se diffDays é um número válido
  if (!isFinite(diffDays)) {
    return "Erro no cálculo da data";
  }

  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  return rtf.format(-diffDays, "day");
}

export function formatDate(dateStr: string): string {
  // Corrigir problema: strings YYYY-MM-DD são interpretadas como UTC
  let date: Date;

  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Se é formato YYYY-MM-DD (sem horário), criar data local
    const [year, month, day] = dateStr.split("-").map(Number);
    date = new Date(year, month - 1, day); // mês é 0-indexed
  } else {
    // Se tem horário ou é ISO string, usar normalmente
    date = new Date(dateStr);
  }

  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
