import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import {
  getCurrentSession,
  homeRouteForRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { listTenants, isPlatformAdmin } from "@/modules/platform/server";
import { ProvisionTenantForm, PlatformTenantsTable } from "@/modules/platform";

export default async function PlatformTenantsPage() {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isPlatformAdmin(session)) redirect(homeRouteForRole(session.role));

  const tenants = await listTenants(session);

  return (
    <PageScaffold
      title="Fraccionamientos"
      subtitle="Administra los fraccionamientos de la plataforma"
      icon={<Building2 className="h-5 w-5 text-white" />}
      headerActions={<ProvisionTenantForm />}
    >
      <section className="rounded-xl border border-border bg-card p-4">
        <PlatformTenantsTable tenants={tenants} />
      </section>
    </PageScaffold>
  );
}
