import { AuthShell, LoginForm } from "@/modules/auth";

export default function LoginPage() {
  return (
    <AuthShell
      title="Fraccionamiento Manager"
      subtitle="Ingresa con tu cuenta para continuar"
    >
      <LoginForm />
    </AuthShell>
  );
}
