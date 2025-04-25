const eventTypeColors = new Map<string, string>([
  ["culto", "violet"],
  ["devocional", "orange"],
]);

export const getColorForEventType = (eventType: string) => {
  return eventTypeColors.get(eventType) || "gray";
};
