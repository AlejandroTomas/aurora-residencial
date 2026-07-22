import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Boxes, ChevronLeft } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import {
  getCurrentSession,
  isAdminRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { getStreet, listBlocks } from "@/modules/structure/server";
import {
  StructureLevel,
  createBlockAction,
  renameBlockAction,
  setBlockActiveAction,
} from "@/modules/structure";

export default async function BlocksPage({
  params,
}: {
  params: Promise<{ stageId: string; streetId: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isAdminRole(session.role)) redirect(AUTH_ROUTES.afterLogin);

  const { stageId, streetId } = await params;
  const street = await getStreet(session, streetId);
  if (!street) notFound();

  const blocks = await listBlocks(session, streetId);

  return (
    <PageScaffold
      title={street.name}
      subtitle="Manzanas de la calle"
      icon={<Boxes className="h-5 w-5 text-white" />}
    >
      <div className="space-y-4">
        <Link
          href={`/estructura/${stageId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Calles
        </Link>
        <section className="rounded-xl border border-border bg-card p-4">
          <StructureLevel
            nodes={blocks}
            parentId={streetId}
            entityLabel="manzana"
            childBasePath={`/estructura/${stageId}/${streetId}`}
            createAction={createBlockAction}
            renameAction={renameBlockAction}
            setActiveAction={setBlockActiveAction}
          />
        </section>
      </div>
    </PageScaffold>
  );
}
