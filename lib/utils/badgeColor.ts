const eventTypeColors = new Map<string, string>([
  ["culto", "violet"],
  ["devocional", "orange"],
  ["Culto", "violet"],
  ["Devocional", "orange"],
  ["Estudo Bíblico", "blue"],
  ["Retiro", "green"],
  ["Conferência", "red"],
  ["Outro", "gray"],
]);

export const getColorForEventType = (eventType: string) => {
  return eventTypeColors.get(eventType) || "gray";
};

export const badgeColor = (eventType: string) => {
  return getColorForEventType(eventType);
};
