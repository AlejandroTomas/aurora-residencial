import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import { SearchInput, Pagination } from "@/components/shared";
import { DEFAULT_PAGE_SIZE } from "@/core/types";
import { parsePageParam } from "@/core/utils";
import {
  getCurrentSession,
  isAdminRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { listUsers } from "@/modules/users/server";
import { InviteUserForm, UsersTable } from "@/modules/users";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isAdminRole(session.role)) redirect(AUTH_ROUTES.afterLogin);

  const sp = await searchParams;
  const page = parsePageParam(sp.page);
  const search = sp.q?.trim() || undefined;

  const users = await listUsers(
    session,
    { page, pageSize: DEFAULT_PAGE_SIZE },
    search,
  );

  return (
    <PageScaffold
      title="Usuarios"
      subtitle="Administra el acceso al fraccionamiento"
      icon={<Users className="h-5 w-5 text-white" />}
    >
      <div className="space-y-8">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Invitar usuario
          </h2>
          <InviteUserForm />
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-semibold text-foreground">
              Usuarios ({users.total})
            </h2>
          </div>
          <SearchInput placeholder="Buscar por nombre o correo…" />
          <UsersTable users={users.items} currentUserId={session.userId} />
          <Pagination page={users.page} totalPages={users.totalPages} />
        </section>
      </div>
    </PageScaffold>
  );
}
