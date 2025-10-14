import { useTelemetryContext } from "@/providers/TelemetryProvider";

export const useTelemetry = () => {
  const { track, page } = useTelemetryContext();
  return {
    track,
    page,
  };
};
