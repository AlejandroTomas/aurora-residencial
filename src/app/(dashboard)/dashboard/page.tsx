import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { LayoutDashboard, Building2, Users, Megaphone } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import {
  getCurrentSession,
  isAdminRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { getDashboardMetrics } from "@/modules/dashboard/server";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);

  const metrics = isAdminRole(session.role)
    ? await getDashboardMetrics(session)
    : null;

  return (
    <PageScaffold
      title="Dashboard"
      subtitle={`Bienvenido, ${session.fullName}`}
      icon={<LayoutDashboard className="h-5 w-5 text-white" />}
    >
      {metrics ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Residentes"
            value={metrics.residents}
            icon={<Building2 className="h-5 w-5" />}
          />
          <StatCard
            label="Usuarios"
            value={metrics.users}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            label="Comunicados"
            value={metrics.announcements}
            icon={<Megaphone className="h-5 w-5" />}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Consulta los comunicados del fraccionamiento desde el menú.
          </p>
        </div>
      )}
    </PageScaffold>
  );
}
