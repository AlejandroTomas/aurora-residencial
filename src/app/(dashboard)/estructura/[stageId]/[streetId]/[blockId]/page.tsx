import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Boxes, ChevronLeft } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import {
  getCurrentSession,
  isAdminRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { getBlock, listLots } from "@/modules/structure/server";
import { LotList } from "@/modules/structure";

export default async function LotsPage({
  params,
}: {
  params: Promise<{ stageId: string; streetId: string; blockId: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isAdminRole(session.role)) redirect(AUTH_ROUTES.afterLogin);

  const { stageId, streetId, blockId } = await params;
  const block = await getBlock(session, blockId);
  if (!block) notFound();

  const lots = await listLots(session, blockId);

  return (
    <PageScaffold
      title={`Manzana ${block.name}`}
      subtitle="Lotes de la manzana"
      icon={<Boxes className="h-5 w-5 text-white" />}
    >
      <div className="space-y-4">
        <Link
          href={`/estructura/${stageId}/${streetId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Manzanas
        </Link>
        <section className="rounded-xl border border-border bg-card p-4">
          <LotList lots={lots} blockId={blockId} />
        </section>
      </div>
    </PageScaffold>
  );
}
