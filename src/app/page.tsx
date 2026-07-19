import AdminLayout from "@/components/layouts/AdminLayout";
import PageScaffold from "@/components/layouts/PageScaffold";
import { SileoToastDemo } from "@/components/feedback/SileoToastDemo";

import { LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    <AdminLayout>
      <PageScaffold
        title="Aurora Template"
        subtitle="Plantilla base para aplicaciones SaaS"
        icon={<LayoutDashboard className="h-5 w-5 text-white" />}
      >
        <div className="space-y-6">
          <SileoToastDemo />
        </div>
      </PageScaffold>
    </AdminLayout>
  );
}
