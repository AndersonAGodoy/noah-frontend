const eventTypeColors = new Map<string, string>([
  ["culto", "blue"],
  ["evento", "green"],
  ["reuniao", "orange"],
]);

export const getColorForEventType = (eventType: string) => {
  return eventTypeColors.get(eventType) || "gray";
};
