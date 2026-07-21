import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import { Pagination } from "@/components/shared";
import { DEFAULT_PAGE_SIZE } from "@/core/types";
import { parsePageParam } from "@/core/utils";
import {
  getCurrentSession,
  homeRouteForRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { listTenants, isPlatformAdmin } from "@/modules/platform/server";
import { ProvisionTenantForm, PlatformTenantsTable } from "@/modules/platform";

export default async function PlatformTenantsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isPlatformAdmin(session)) redirect(homeRouteForRole(session.role));

  const page = parsePageParam((await searchParams).page);
  const tenants = await listTenants(session, {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  return (
    <PageScaffold
      title="Fraccionamientos"
      subtitle="Administra los fraccionamientos de la plataforma"
      icon={<Building2 className="h-5 w-5 text-white" />}
      headerActions={<ProvisionTenantForm />}
    >
      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="px-2 text-sm font-semibold text-foreground">
          Fraccionamientos ({tenants.total})
        </h2>
        <PlatformTenantsTable tenants={tenants.items} />
        <Pagination page={tenants.page} totalPages={tenants.totalPages} />
      </section>
    </PageScaffold>
  );
}
