import { notFound } from "next/navigation";
import { AuthShell } from "@/modules/auth";
import { RegisterForm } from "@/modules/membership";
import { getRegistrationContext } from "@/modules/membership/server";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const context = await getRegistrationContext(slug);
  if (!context) notFound();

  return (
    <AuthShell
      title={context.tenantName}
      subtitle="Crea tu cuenta de residente"
    >
      <RegisterForm slug={slug} lots={context.lots} />
    </AuthShell>
  );
}
