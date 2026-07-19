import AdminLayout from "@/components/layouts/AdminLayout";
import PageScaffold from "@/components/layouts/PageScaffold";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <AdminLayout>
      <PageScaffold
        title="Dashboard"
        subtitle="Resumen del fraccionamiento"
        icon={<LayoutDashboard className="h-5 w-5 text-white" />}
      >
        <p className="text-sm text-muted-foreground">
          Pendiente de implementar — Fase 4 (modules/dashboard) en
          .ai/control/alignment.md.
        </p>
      </PageScaffold>
    </AdminLayout>
  );
}
