import net from "node:net";
import tls from "node:tls";

type ConsultationNotification = {
  body: string;
  subject: string;
  to: string[];
};

function getMailFrom() {
  return process.env.SMTP_FROM
    || process.env.SMTP_USER
    || "noreply@dewandakwahsemarang.com";
}

function encodeHeader(value: string) {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function escapeSmtpData(value: string) {
  return value.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
}

function waitForLine(socket: net.Socket | tls.TLSSocket) {
  return new Promise<string>((resolve, reject) => {
    let buffer = "";

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const lastLine = lines.at(-1);

      if (lastLine && /^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(buffer);
      }
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function sendCommand(socket: net.Socket | tls.TLSSocket, command: string, okCodes: number[]) {
  socket.write(`${command}\r\n`);
  const response = await waitForLine(socket);
  const code = Number(response.slice(0, 3));

  if (!okCodes.includes(code)) {
    throw new Error(`SMTP command failed (${command}): ${response.trim()}`);
  }

  return response;
}

function connectSmtp(host: string, port: number, secure: boolean) {
  return new Promise<net.Socket | tls.TLSSocket>((resolve, reject) => {
    const onConnect = (socket: net.Socket | tls.TLSSocket) => {
      socket.off("error", reject);
      resolve(socket);
    };
    const socket = secure
      ? tls.connect(port, host, { servername: host }, () => onConnect(socket))
      : net.connect(port, host, () => onConnect(socket));

    socket.once("error", reject);
  });
}

function upgradeToTls(socket: net.Socket | tls.TLSSocket, host: string) {
  return new Promise<tls.TLSSocket>((resolve, reject) => {
    const tlsSocket = tls.connect({ servername: host, socket }, () => resolve(tlsSocket));
    tlsSocket.once("error", reject);
  });
}

async function sendViaSmtp(notification: ConsultationNotification) {
  const host = process.env.SMTP_HOST;
  if (!host) return false;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = getMailFrom();
  const fromName = process.env.SMTP_FROM_NAME || "PMB DDI Semarang";
  const socket = await connectSmtp(host, port, secure);

  try {
    await waitForLine(socket);
    await sendCommand(socket, `EHLO ${process.env.SMTP_HELO_HOST || "localhost"}`, [250]);

    let activeSocket = socket;
    if (!secure && process.env.SMTP_STARTTLS !== "false") {
      await sendCommand(activeSocket, "STARTTLS", [220]);
      activeSocket = await upgradeToTls(activeSocket, host);
      await sendCommand(activeSocket, `EHLO ${process.env.SMTP_HELO_HOST || "localhost"}`, [250]);
    }

    if (user && pass) {
      await sendCommand(activeSocket, "AUTH LOGIN", [334]);
      await sendCommand(activeSocket, Buffer.from(user).toString("base64"), [334]);
      await sendCommand(activeSocket, Buffer.from(pass).toString("base64"), [235]);
    }

    await sendCommand(activeSocket, `MAIL FROM:<${from}>`, [250]);
    for (const recipient of notification.to) {
      await sendCommand(activeSocket, `RCPT TO:<${recipient}>`, [250, 251]);
    }
    await sendCommand(activeSocket, "DATA", [354]);

    const message = [
      `From: ${encodeHeader(fromName)} <${from}>`,
      `To: ${notification.to.join(", ")}`,
      `Subject: ${encodeHeader(notification.subject)}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      escapeSmtpData(notification.body),
      ".",
    ].join("\r\n");

    await sendCommand(activeSocket, message, [250]);
    await sendCommand(activeSocket, "QUIT", [221]);
    activeSocket.end();
    return true;
  } catch (error) {
    socket.destroy();
    throw error;
  }
}

export async function sendConsultationEmailNotification(notification: ConsultationNotification) {
  const webhookUrl = process.env.EMAIL_NOTIFICATION_WEBHOOK_URL;

  if (!webhookUrl) {
    try {
      const sent = await sendViaSmtp(notification);
      if (sent) return;
    } catch (error) {
      console.warn("SMTP email notification failed.", error);
      return;
    }

    console.info("Email notification skipped. Set SMTP_HOST or EMAIL_NOTIFICATION_WEBHOOK_URL to enable it.", {
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
