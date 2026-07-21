import { redirect } from "next/navigation";
import AppLayout, { type NavItem } from "@/components/layouts/Sidebar";
import {
  getCurrentSession,
  homeRouteForRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { isPlatformAdmin } from "@/modules/platform/server";

/**
 * Shell del nivel Plataforma. Exclusivo del SUPER_ADMIN: cualquier otro rol se redirige a
 * su propio inicio (los niveles no se mezclan). Defense in depth sobre el proxy.
 */
const NAV_ITEMS: NavItem[] = [
  { label: "Fraccionamientos", url: "/platform", icon: "building" },
];

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isPlatformAdmin(session)) redirect(homeRouteForRole(session.role));

  return (
    <AppLayout
      items={NAV_ITEMS}
      brand="Plataforma"
      brandLetter="P"
      user={{ name: session.fullName, role: session.role }}
    >
      <main
        className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4 pt-[calc(1rem+var(--ios-navbar-offset,0px))] md:p-6 md:pt-[calc(1.5rem+var(--ios-navbar-offset,0px))]"
        style={{
          WebkitOverflowScrolling: "touch",
          paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom,0px))",
        }}
      >
        {children}
      </main>
    </AppLayout>
  );
}
