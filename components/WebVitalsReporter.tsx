"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsReporter() {
    useReportWebVitals((metric) => {
        // Log apenas em desenvolvimento
        if (process.env.NODE_ENV === "development") {
            console.log(`[Web Vitals] ${metric.name}:`, metric.value);
        }

        // Em produção, você pode enviar para um serviço de analytics
        // Exemplo: Google Analytics, Vercel Analytics, etc.
        if (process.env.NODE_ENV === "production") {
            // Exemplo com Google Analytics
            if (window.gtag) {
                window.gtag("event", metric.name, {
                    value: Math.round(
                        metric.name === "CLS" ? metric.value * 1000 : metric.value
                    ),
                    event_category: "Web Vitals",
                    event_label: metric.id,
                    non_interaction: true,
                });
            }

            // Ou enviar para seu próprio endpoint
            // fetch('/api/analytics', {
            //   method: 'POST',
            //   body: JSON.stringify(metric),
            // });
        }
    });

    return null;
}

// TypeScript declaration para gtag
declare global {
    interface Window {
        gtag?: (
            command: string,
            eventName: string,
            params?: Record<string, unknown>
        ) => void;
    }
}
