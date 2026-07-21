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
import { formatDate } from "@/core/utils";
import { setTenantActiveAction, updateTenantPlanAction } from "../actions";
import { PLAN_LABELS, SUBSCRIPTION_PLANS } from "../constants";
import type { PlatformTenantDto } from "../types";

const SELECT_CLASS =
  "h-8 rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50 dark:bg-input/30";

export function PlatformTenantsTable({
  tenants,
}: {
  tenants: PlatformTenantDto[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const toggleActive = (tenant: PlatformTenantDto) => {
    setPendingId(tenant.id);
    startTransition(async () => {
      const result = await setTenantActiveAction({
        tenantId: tenant.id,
        isActive: !tenant.isActive,
      });
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(
          tenant.isActive
            ? "Fraccionamiento suspendido."
            : "Fraccionamiento activado.",
        );
        router.refresh();
      }
      setPendingId(null);
    });
  };

  const changePlan = (tenantId: string, plan: string) => {
    setPendingId(tenantId);
    startTransition(async () => {
      const result = await updateTenantPlanAction({ tenantId, plan });
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Plan actualizado.");
        router.refresh();
      }
      setPendingId(null);
    });
  };

  if (tenants.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aún no hay fraccionamientos. Crea el primero.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fraccionamiento</TableHead>
            <TableHead>Identificador</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Alta</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => {
            const busy = pendingId === tenant.id;
            return (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {tenant.slug}
                </TableCell>
                <TableCell>
                  <select
                    aria-label={`Plan de ${tenant.name}`}
                    className={SELECT_CLASS}
                    value={tenant.plan}
                    disabled={busy}
                    onChange={(event) =>
                      changePlan(tenant.id, event.target.value)
                    }
                  >
                    {SUBSCRIPTION_PLANS.map((plan) => (
                      <option key={plan} value={plan}>
                        {PLAN_LABELS[plan]}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(tenant.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant={tenant.isActive ? "secondary" : "outline"}>
                    {tenant.isActive ? "Activo" : "Suspendido"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => toggleActive(tenant)}
                  >
                    {tenant.isActive ? "Suspender" : "Activar"}
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
