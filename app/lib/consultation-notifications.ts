type ConsultationNotification = {
  body: string;
  subject: string;
  to: string[];
};

export async function sendConsultationEmailNotification(notification: ConsultationNotification) {
  const webhookUrl = process.env.EMAIL_NOTIFICATION_WEBHOOK_URL;

  if (!webhookUrl) {
    console.info("Email notification skipped. Set EMAIL_NOTIFICATION_WEBHOOK_URL to enable it.", {
      subject: notification.subject,
      to: notification.to,
    });
    return;
  }

  try {
    await fetch(webhookUrl, {
      body: JSON.stringify(notification),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
  } catch (error) {
    console.warn("Email notification failed.", error);
  }
}
