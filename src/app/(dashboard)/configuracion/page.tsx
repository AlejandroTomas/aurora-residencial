import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import {
  getCurrentSession,
  isAdminRole,
  AUTH_ROUTES,
} from "@/modules/auth/server";
import { getCurrentTenant } from "@/modules/tenants/server";
import { TenantForm } from "@/modules/tenants";
import { getSettings } from "@/modules/settings/server";
import { SettingsForm } from "@/modules/settings";

export default async function SettingsPage() {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);
  if (!isAdminRole(session.role)) redirect(AUTH_ROUTES.afterLogin);

  const [tenant, settings] = await Promise.all([
    getCurrentTenant(session),
    getSettings(session),
  ]);

  return (
    <PageScaffold
      title="Configuración"
      subtitle="Datos y preferencias del fraccionamiento"
      icon={<Settings className="h-5 w-5 text-white" />}
    >
      <div className="space-y-8">
        <section className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Fraccionamiento
          </h2>
          <TenantForm tenant={tenant} />
        </section>

        <section className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">Preferencias</h2>
          <SettingsForm settings={settings} />
        </section>
      </div>
    </PageScaffold>
  );
}
