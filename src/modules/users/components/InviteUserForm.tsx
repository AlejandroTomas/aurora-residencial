"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteUserSchema, type InviteUserInput } from "../schemas";
import { inviteUserAction } from "../actions";
import { ASSIGNABLE_ROLES, ROLE_LABELS } from "../constants";

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30";

export function InviteUserForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: { email: "", fullName: "", role: "RESIDENT" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await inviteUserAction(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Invitación enviada.");
    reset();
    router.refresh();
  });

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="invite-name">Nombre completo</Label>
        <Input
          id="invite-name"
          aria-invalid={Boolean(errors.fullName)}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-email">Correo</Label>
        <Input
          id="invite-email"
          type="email"
          autoComplete="off"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-role">Rol</Label>
        <select id="invite-role" className={SELECT_CLASS} {...register("role")}>
          {ASSIGNABLE_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Invitar usuario
      </Button>
    </form>
  );
}
