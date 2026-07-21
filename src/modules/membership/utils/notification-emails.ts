interface EmailContent {
  subject: string;
  html: string;
}

// Se escapa toda entrada de usuario (nombre, comentario) antes de incrustarla en el HTML.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(title: string, body: string): string {
  return `<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #111827;">
    <h2 style="margin: 0 0 16px;">${title}</h2>
    ${body}
    <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">Fraccionamiento Manager</p>
  </div>`;
}

export function renderApprovalEmail(
  fullName: string,
  loginUrl?: string,
): EmailContent {
  const cta = loginUrl
    ? `<p style="margin-top:16px;"><a href="${escapeHtml(loginUrl)}" style="background:#4f46e5;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">Iniciar sesión</a></p>`
    : "";
  return {
    subject: "Tu solicitud fue aprobada",
    html: layout(
      "¡Bienvenido!",
      `<p>Hola ${escapeHtml(fullName)}, tu solicitud de registro fue <strong>aprobada</strong>. Ya puedes iniciar sesión y acceder a tu fraccionamiento.</p>${cta}`,
    ),
  };
}

export function renderRejectionEmail(
  fullName: string,
  comment: string | null,
): EmailContent {
  const reason = comment
    ? `<p><strong>Motivo:</strong> ${escapeHtml(comment)}</p>`
    : "";
  return {
    subject: "Actualización de tu solicitud",
    html: layout(
      "Solicitud rechazada",
      `<p>Hola ${escapeHtml(fullName)}, tu solicitud de registro fue rechazada.</p>${reason}<p>Contacta al administrador del fraccionamiento para más información.</p>`,
    ),
  };
}
