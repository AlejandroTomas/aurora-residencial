import { redirect } from "next/navigation";
import { Boxes } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import {
  getCurrentSession,
  isAdminRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { listStages } from "@/modules/structure/server";
import {
  StructureLevel,
  createStageAction,
  renameStageAction,
  setStageActiveAction,
} from "@/modules/structure";

export default async function StagesPage() {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isAdminRole(session.role)) redirect(AUTH_ROUTES.afterLogin);

  const stages = await listStages(session);

  return (
    <PageScaffold
      title="Estructura"
      subtitle="Etapas del fraccionamiento"
      icon={<Boxes className="h-5 w-5 text-white" />}
    >
      <section className="rounded-xl border border-border bg-card p-4">
        <StructureLevel
          nodes={stages}
          entityLabel="etapa"
          childBasePath="/estructura"
          createAction={createStageAction}
          renameAction={renameStageAction}
          setActiveAction={setStageActiveAction}
        />
      </section>
    </PageScaffold>
  );
}
