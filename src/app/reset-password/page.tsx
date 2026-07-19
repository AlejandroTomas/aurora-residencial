import { AuthShell, UpdatePasswordForm } from "@/modules/auth";

/**
 * Fuera del grupo (auth) a propósito: se llega aquí con una sesión de recuperación
 * activa, y el layout de (auth) redirige toda sesión al dashboard.
 */
export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Nueva contraseña"
      subtitle="Define una contraseña para tu cuenta"
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
