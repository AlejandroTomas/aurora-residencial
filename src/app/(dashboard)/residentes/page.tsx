import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import { SearchInput, Pagination } from "@/components/shared";
import { DEFAULT_PAGE_SIZE } from "@/core/types";
import { parsePageParam } from "@/core/utils";
import {
  getCurrentSession,
  isAdminRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { listResidents, getLotOptions } from "@/modules/residents/server";
import {
  ResidentsTable,
  ResidentFormDialog,
  type LotOption,
} from "@/modules/residents";

export default async function ResidentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);

  const isAdmin = isAdminRole(session.role);
  const isGuard = session.role === "GUARD";
  if (!isAdmin && !isGuard) redirect(AUTH_ROUTES.afterLogin);

  const sp = await searchParams;
  const page = parsePageParam(sp.page);
  const search = sp.q?.trim() || undefined;

  const [residents, lots] = await Promise.all([
    listResidents(session, { page, pageSize: DEFAULT_PAGE_SIZE }, search),
    isAdmin ? getLotOptions(session) : Promise.resolve([] as LotOption[]),
  ]);

  return (
    <PageScaffold
      title="Residentes"
      subtitle="Padrón del fraccionamiento"
      icon={<Building2 className="h-5 w-5 text-white" />}
      headerActions={
        isAdmin ? <ResidentFormDialog lots={lots} /> : undefined
      }
    >
      <section className="space-y-4 rounded-xl border border-border bg-card p-4">
        <SearchInput placeholder="Buscar por nombre o correo…" />
        <ResidentsTable
          residents={residents.items}
          lots={lots}
          canManage={isAdmin}
        />
        <Pagination page={residents.page} totalPages={residents.totalPages} />
      </section>
    </PageScaffold>
  );
}
