import { ApiError } from "src/error/ApiError";
import { logger } from "src/lib/logger";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASS,
  },
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
