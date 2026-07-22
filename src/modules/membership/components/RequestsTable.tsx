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
import { Button } from "@/components/ui/button";
import { formatDate } from "@/core/utils";
import { approveRequestAction } from "../actions";
import { RejectRequestDialog } from "./RejectRequestDialog";
import type { MembershipRequestDto } from "../types";

export function RequestsTable({
  requests,
}: {
  requests: MembershipRequestDto[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const approve = (requestId: string) => {
    setPendingId(requestId);
    startTransition(async () => {
      const result = await approveRequestAction({ requestId });
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Solicitud aprobada. El residente ya fue registrado.");
        router.refresh();
      }
      setPendingId(null);
    });
  };

  if (requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay solicitudes pendientes.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Lote solicitado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const busy = pendingId === request.id;
            return (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.fullName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {request.phone ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {request.lotLabel}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(request.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => approve(request.id)}
                    >
                      Aprobar
                    </Button>
                    <RejectRequestDialog
                      requestId={request.id}
                      trigger={
                        <Button variant="outline" size="sm" disabled={busy}>
                          Rechazar
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
