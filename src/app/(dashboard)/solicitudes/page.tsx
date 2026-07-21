import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import {
  getCurrentSession,
  isAdminRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { listPendingRequests } from "@/modules/membership/server";
import { RequestsTable } from "@/modules/membership";

export default async function RequestsPage() {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isAdminRole(session.role)) redirect(AUTH_ROUTES.afterLogin);

  const requests = await listPendingRequests(session);

  return (
    <PageScaffold
      title="Solicitudes"
      subtitle="Aprueba o rechaza el registro de residentes"
      icon={<ClipboardList className="h-5 w-5 text-white" />}
    >
      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="px-2 text-sm font-semibold text-foreground">
          Pendientes ({requests.length})
        </h2>
        <RequestsTable requests={requests} />
      </section>
    </PageScaffold>
  );
}
