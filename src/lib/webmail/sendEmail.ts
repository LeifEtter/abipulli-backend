import { ApiError } from "src/error/ApiError";
import { logger } from "src/lib/logger";
import nodemailer from "nodemailer";
import dns from "dns";
import SMTPConnection from "nodemailer/lib/smtp-connection";

import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
  tls: { servername: "smtp.zoho.eu", rejectUnauthorized: true },
  dnsLookup: (
    hostname: string,
    _opts: unknown,
    cb: (
      err: NodeJS.ErrnoException | null,
      address: string,
      family: number
    ) => void
  ) => {
    dns.lookup(hostname, { family: 4 }, cb);
  },
} as SMTPTransport.Options);

export const sendEmail = async (
  email: string,
  subject: string,
  text: string
) => {
  try {
    await transporter.sendMail({
      from: `Abipulli.com <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject,
      text,
    });
  } catch (error) {
    logger.error(error);
    throw new ApiError({
      code: 500,
      info: "Failed to send email",
    });
  }
};
