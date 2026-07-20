import { redirect } from "next/navigation";
import { User } from "lucide-react";
import PageScaffold from "@/components/layouts/PageScaffold";
import { getCurrentSession, AUTH_ROUTES } from "@/modules/auth/server";
import { getMyProfile } from "@/modules/profile/server";
import { ProfileForm } from "@/modules/profile";

export default async function ProfilePage() {
  const session = await getCurrentSession();
  if (!session) redirect(AUTH_ROUTES.login);

  const profile = await getMyProfile(session);

  return (
    <PageScaffold
      title="Mi perfil"
      subtitle="Tus datos de cuenta"
      icon={<User className="h-5 w-5 text-white" />}
    >
      <div className="max-w-xl rounded-xl border border-border bg-card p-6">
        <ProfileForm profile={profile} />
      </div>
    </PageScaffold>
  );
}
