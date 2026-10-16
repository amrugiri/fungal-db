import nodemailer from "nodemailer";

export type AdminEmailAttachment = {
  filename: string;
  contentType: string;
  content: Buffer;
};

export type AdminEmail = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: AdminEmailAttachment[];
};

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "amruthagirivasan@gmail.com";

export function adminNotifyEmail(): string {
  return ADMIN_EMAIL;
}

export async function sendAdminEmail(message: AdminEmail): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    await sendWithResend(resendKey, message);
    return;
  }

  const gmailUser = process.env.GMAIL_USER ?? ADMIN_EMAIL;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (gmailPass) {
    await sendWithGmail(gmailUser, gmailPass, message);
    return;
  }

  await sendWithFormSubmit(message);
}

async function sendWithResend(apiKey: string, message: AdminEmail): Promise<void> {
  const from = process.env.RESEND_FROM ?? "MycoProt <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [ADMIN_EMAIL],
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo,
      attachments: message.attachments?.map((file) => ({
        filename: file.filename,
        content: file.content.toString("base64"),
        contentType: file.contentType,
      })),
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed (${response.status}): ${body.slice(0, 400)}`);
  }
}

async function sendWithGmail(user: string, pass: string, message: AdminEmail): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: `MycoProt contributions <${user}>`,
    to: ADMIN_EMAIL,
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
    text: message.text,
    attachments: message.attachments?.map((file) => ({
      filename: file.filename,
      content: file.content,
      contentType: file.contentType,
    })),
  });
}

async function sendWithFormSubmit(message: AdminEmail): Promise<void> {
  const names = message.attachments?.map((file) => file.filename).join(", ");
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(ADMIN_EMAIL)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: message.subject,
      _replyto: message.replyTo,
      _template: "box",
      message: names
        ? `${message.text}\n\nAttached files were named: ${names}. Binary files are forwarded only when GMAIL_APP_PASSWORD or RESEND_API_KEY is set.`
        : message.text,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Formsubmit failed (${response.status}): ${body.slice(0, 400)}`);
  }
}
