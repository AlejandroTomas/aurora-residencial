"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateUserRoleAction, setUserActiveAction } from "../actions";
import { ASSIGNABLE_ROLES, ROLE_LABELS } from "../constants";
import type { UserDto } from "../types";

const SELECT_CLASS =
  "h-8 rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50 dark:bg-input/30";

interface UsersTableProps {
  users: UserDto[];
  currentUserId: string;
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const run = (userId: string, action: () => Promise<void>) => {
    setPendingId(userId);
    startTransition(async () => {
      await action();
      setPendingId(null);
    });
  };

  const changeRole = (userId: string, role: string) => {
    run(userId, async () => {
      const result = await updateUserRoleAction({ userId, role });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Rol actualizado.");
      router.refresh();
    });
  };

  const toggleActive = (user: UserDto) => {
    run(user.id, async () => {
      const result = await setUserActiveAction({
        userId: user.id,
        isActive: !user.isActive,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(user.isActive ? "Usuario desactivado." : "Usuario activado.");
      router.refresh();
    });
  };

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Aún no hay usuarios.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const isSuperAdmin = user.role === "SUPER_ADMIN";
            const busy = pendingId === user.id;
            const roleEditable = !isSelf && !isSuperAdmin;

            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  {roleEditable ? (
                    <select
                      aria-label={`Rol de ${user.fullName}`}
                      className={SELECT_CLASS}
                      value={user.role}
                      disabled={busy}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                    >
                      {ASSIGNABLE_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm">{ROLE_LABELS[user.role]}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "secondary" : "outline"}>
                    {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isSelf || busy}
                    onClick={() => toggleActive(user)}
                  >
                    {user.isActive ? "Desactivar" : "Activar"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
