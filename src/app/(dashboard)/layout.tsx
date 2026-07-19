import { redirect } from "next/navigation";
import AppLayout, { type NavItem } from "@/components/layouts/Sidebar";
import { getCurrentSession, AUTH_ROUTES } from "@/modules/auth/server";

/**
 * Shell autenticado de la aplicación. Exige sesión válida (defense in depth: el proxy
 * ya bloqueó a los no autenticados, aquí se revalida) y pasa el usuario real al sidebar.
 *
 * El menú es fijo por ahora; su construcción dinámica por rol/permisos entra en Fase 5,
 * conforme aterricen los módulos del MVP con sus rutas.
 */
const NAV_ITEMS: NavItem[] = [{ label: "Inicio", url: "/dashboard", icon: "home" }];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);

  return (
    <AppLayout
      items={NAV_ITEMS}
      brand="Fraccionamiento"
      brandLetter="F"
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
