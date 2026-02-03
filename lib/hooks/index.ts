// lib/hooks/index.ts

// Theme hooks
export { useTheme } from "./useTheme";
export { useClientColorScheme } from "./useClientColorScheme";

// Participants hooks
export { default as useCreateParticipantFirebase } from "./useCreateParticipantFirebase";
export { default as useGetAllParticipantsFirebase } from "./useGetAllParticipantsFirebase";
export { useGetParticipantsFirebase } from "./useGetParticipantsFirebase";

// Sermons hooks
export { default as useCreateSermonFirebase } from "./useCreateSermonFirebase";
export {
  default as useDeleteSermonFirebase,
  usePublishSermonFirebase,
  useUnpublishSermonFirebase,
} from "./useDeleteSermonFirebase";
export { useGetSermonsFirebase } from "./useGetSermonsFirebase";
export { default as useUpdateSermonFirebase } from "./useUpdateSermonFirebase";

// Encounters hooks
export { useCreateEncounter } from "./useCreateEncounter";
export { useGetEncounters } from "./useGetEncounters";
export { useGetActiveEncounter } from "./useGetActiveEncounter";
export { useSetActiveEncounter } from "./useSetActiveEncounter";
export { useUpdateEncounter } from "./useUpdateEncounter";
export { useAutoDeactivateExpiredEncounters } from "./useAutoDeactivateExpiredEncounters";

// Scroll hooks
export {
  useScrollToTop,
  useInstantScrollToTop,
  scrollToTop,
  useScrollToElement,
} from "./useScrollToTop";

// FCM hooks
export { useGetAllFCMTokens } from "./useGetAllFCMTokens";
export { useFCMToken } from "./useFCMToken";
