type AnalyticsPayload = {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
};

const emitEvent = (payload: AnalyticsPayload) => {
  if (typeof window === "undefined") return;

  if (Array.isArray((window as typeof window & { dataLayer?: unknown[] }).dataLayer)) {
    (window as typeof window & { dataLayer?: unknown[] }).dataLayer!.push({
      event: payload.name,
      properties: payload.properties ?? {},
      timestamp: payload.timestamp,
    });
  }

  window.dispatchEvent(new CustomEvent("analytics:event", { detail: payload }));

  if (import.meta.env.DEV) {
    console.debug(`[analytics] ${payload.name}`, payload.properties ?? {});
  }
};

export const trackEvent = (name: string, properties?: Record<string, unknown>) => {
  const payload: AnalyticsPayload = {
    name,
    properties,
    timestamp: Date.now(),
  };

  emitEvent(payload);
};
