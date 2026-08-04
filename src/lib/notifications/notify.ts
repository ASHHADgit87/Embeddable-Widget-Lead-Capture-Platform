import { Resend } from "resend";

interface NotifySubmissionParams {
  ownerEmail: string;
  widgetTitle: string;
  submissionData: Record<string, unknown>;
}

export interface NotifyResult {
  sent: boolean;
  error: string | null;
}

const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

export async function notifyNewSubmission(
  params: NotifySubmissionParams,
): Promise<NotifyResult> {
  try {
    if (!resendClient) {
      console.log("[notify] (no RESEND_API_KEY set — logging only)", {
        to: params.ownerEmail,
        widget: params.widgetTitle,
        data: params.submissionData,
      });
      return { sent: true, error: null };
    }

    await resendClient.emails.send({
      from: process.env.NOTIFICATION_FROM_EMAIL ?? "onboarding@resend.dev",
      to: params.ownerEmail,
      subject: `New submission — ${params.widgetTitle}`,
      text: `You received a new submission on "${params.widgetTitle}":\n\n${JSON.stringify(
        params.submissionData,
        null,
        2,
      )}`,
    });

    return { sent: true, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown notification error";
    console.error("[notify] failed, submission is unaffected:", message);
    return { sent: false, error: message };
  }
}
