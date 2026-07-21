import "server-only";
import { Resend } from "resend";
import { serverEnv } from "@/core/env/server";
import { logger } from "@/core/logger";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envía un correo con Resend. Es tolerante por diseño: si no hay `RESEND_API_KEY`, se
 * desactiva y solo registra en log (no rompe la operación de negocio). Nunca lanza: un
 * fallo de correo no debe tumbar el caso de uso que lo dispara.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  if (!serverEnv.RESEND_API_KEY) {
    logger.info("Correo desactivado (sin RESEND_API_KEY); se omite el envío", {
      to: input.to,
      subject: input.subject,
    });
    return;
  }

  try {
    const resend = new Resend(serverEnv.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: serverEnv.EMAIL_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
    if (error) {
      logger.error("Fallo al enviar correo", {
        to: input.to,
        error: error.message,
      });
    }
  } catch (error) {
    logger.error("Excepción al enviar correo", {
      to: input.to,
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}
