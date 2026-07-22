import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Boxes, ChevronLeft } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import {
  getCurrentSession,
  isAdminRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { getStage, listStreets } from "@/modules/structure/server";
import {
  StructureLevel,
  createStreetAction,
  renameStreetAction,
  setStreetActiveAction,
} from "@/modules/structure";

export default async function StreetsPage({
  params,
}: {
  params: Promise<{ stageId: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isAdminRole(session.role)) redirect(AUTH_ROUTES.afterLogin);

  const { stageId } = await params;
  const stage = await getStage(session, stageId);
  if (!stage) notFound();

  const streets = await listStreets(session, stageId);

  return (
    <PageScaffold
      title={stage.name}
      subtitle="Calles de la etapa"
      icon={<Boxes className="h-5 w-5 text-white" />}
    >
      <div className="space-y-4">
        <Link
          href="/estructura"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Etapas
        </Link>
        <section className="rounded-xl border border-border bg-card p-4">
          <StructureLevel
            nodes={streets}
            parentId={stageId}
            entityLabel="calle"
            childBasePath={`/estructura/${stageId}`}
            createAction={createStreetAction}
            renameAction={renameStreetAction}
            setActiveAction={setStreetActiveAction}
          />
        </section>
      </div>
    </PageScaffold>
  );
}
