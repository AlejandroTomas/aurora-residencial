import PageScaffold from "@/components/layouts/PageScaffold";
import { getCurrentSession } from "@/modules/auth/server";
import { LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  return (
    <PageScaffold
      title="Dashboard"
      subtitle="Resumen de tu fraccionamiento"
      icon={<LayoutDashboard className="h-5 w-5 text-white" />}
    >
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Bienvenido{session ? `, ${session.fullName}` : ""}.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Los módulos del MVP (Residentes, Comunicados, etc.) se irán habilitando
          aquí en la Fase 4.
        </p>
      </div>
    </PageScaffold>
  );
}
