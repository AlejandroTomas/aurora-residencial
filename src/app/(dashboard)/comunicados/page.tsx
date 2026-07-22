import { redirect } from "next/navigation";
import { Megaphone } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import { Pagination } from "@/components/shared";
import { DEFAULT_PAGE_SIZE } from "@/core/types";
import { parsePageParam } from "@/core/utils";
import {
  getCurrentSession,
  isAdminRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { listAnnouncements } from "@/modules/announcements/server";
import {
  AnnouncementFormDialog,
  AnnouncementsAdminList,
  AnnouncementsReaderList,
} from "@/modules/announcements";

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);

  const isAdmin = isAdminRole(session.role);
  const page = parsePageParam((await searchParams).page);
  const announcements = await listAnnouncements(session, {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  return (
    <PageScaffold
      title="Comunicados"
      subtitle={
        isAdmin
          ? "Crea y publica avisos para el fraccionamiento"
          : "Avisos del fraccionamiento"
      }
      icon={<Megaphone className="h-5 w-5 text-white" />}
      headerActions={
        isAdmin ? <AnnouncementFormDialog /> : undefined
      }
    >
      <div className="space-y-4">
        {isAdmin ? (
          <AnnouncementsAdminList announcements={announcements.items} />
        ) : (
          <AnnouncementsReaderList announcements={announcements.items} />
        )}
        <Pagination
          page={announcements.page}
          totalPages={announcements.totalPages}
        />
      </div>
    </PageScaffold>
  );
}
