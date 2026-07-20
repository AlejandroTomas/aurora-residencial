import type { UserRole } from "@/core/supabase";

export interface ProfileDto {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
}
