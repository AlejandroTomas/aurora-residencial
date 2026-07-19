import { AuthShell, RequestPasswordResetForm } from "@/modules/auth";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te enviaremos instrucciones a tu correo"
    >
      <RequestPasswordResetForm />
    </AuthShell>
  );
}
