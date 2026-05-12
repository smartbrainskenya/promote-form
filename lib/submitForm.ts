import type { PromotionFormValues } from "./schema";

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitForm(
  values: PromotionFormValues
): Promise<SubmitResult> {
  const payload = {
    timestamp: new Date().toISOString(),
    school: values.school,
    grade: values.grade,
    course: values.course,
    startTime: values.startTime,
    endTime: values.endTime,
    leadName: values.leadName,
    leadContact: values.leadContact,
    assistantName: values.assistantName ?? "",
    communicatedTo: values.communicatedTo,
  };

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Server error (${response.status}). Please try again.`,
      };
    }

    const json = await response.json();
    if (json?.status !== "ok") {
      return { ok: false, error: "Unexpected response from server." };
    }

    return { ok: true };
  } catch {
    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
    return {
      ok: false,
      error: isOffline
        ? "No internet connection. Please check your network and try again."
        : "Could not reach the server. Please try again.",
    };
  }
}
