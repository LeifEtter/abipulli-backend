import { ApiError } from "src/error/ApiError";
import { logger } from "src/lib/logger";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  name: "Abipulli",
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
});

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
