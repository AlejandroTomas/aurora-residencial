import { redirect } from "next/navigation";
import AppLayout, { type NavItem } from "@/components/layouts/Sidebar";
import { getCurrentSession, isAdminRole, AUTH_ROUTES } from "@/modules/auth/server";
import type { UserRole } from "@/core/supabase";

/**
 * Shell autenticado de la aplicación. Exige sesión válida (defense in depth: el proxy
 * ya bloqueó a los no autenticados, aquí se revalida) y pasa el usuario real al sidebar.
 *
 * El menú se arma según el rol: las secciones administrativas solo se muestran a admins.
 * Cada página revalida permisos por su cuenta; el menú es solo la primera capa de UX.
 */
function buildNavItems(role: UserRole): NavItem[] {
  const items: NavItem[] = [
    { label: "Inicio", url: "/dashboard", icon: "home" },
    { label: "Comunicados", url: "/comunicados", icon: "megaphone" },
  ];

  if (isAdminRole(role)) {
    items.push(
      { label: "Estructura", url: "/estructura", icon: "boxes" },
      { label: "Residentes", url: "/residentes", icon: "building" },
      { label: "Solicitudes", url: "/solicitudes", icon: "clipboard" },
      { label: "Usuarios", url: "/usuarios", icon: "users" },
      { label: "Configuración", url: "/configuracion", icon: "settings" },
    );
  }

  items.push({ label: "Perfil", url: "/perfil", icon: "user" });
  return items;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  // El SUPER_ADMIN es nivel plataforma: no entra al dashboard de un tenant.
  if (session.role === "SUPER_ADMIN") redirect(AUTH_ROUTES.platform);

  return (
    <AppLayout
      items={buildNavItems(session.role)}
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
