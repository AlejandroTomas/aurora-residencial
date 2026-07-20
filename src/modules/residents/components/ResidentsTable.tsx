"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
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
import { ResidentFormDialog } from "./ResidentFormDialog";
import { setResidentActiveAction } from "../actions";
import type { ResidentDto, LotOption } from "../types";

interface ResidentsTableProps {
  residents: ResidentDto[];
  lots: LotOption[];
  canManage: boolean;
}

export function ResidentsTable({
  residents,
  lots,
  canManage,
}: ResidentsTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const toggleActive = (resident: ResidentDto) => {
    setPendingId(resident.id);
    startTransition(async () => {
      const result = await setResidentActiveAction({
        id: resident.id,
        isActive: !resident.isActive,
      });
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(
          resident.isActive
            ? "Residente suspendido."
            : "Residente reactivado.",
        );
        router.refresh();
      }
      setPendingId(null);
    });
  };

  if (residents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Aún no hay residentes.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Estado</TableHead>
            {canManage && (
              <TableHead className="text-right">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {residents.map((resident) => {
            const busy = pendingId === resident.id;
            return (
              <TableRow key={resident.id}>
                <TableCell className="font-medium">
                  {resident.fullName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {resident.lotLabel}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {resident.email ?? resident.phone ? (
                    <span className="flex flex-col text-xs">
                      {resident.email && <span>{resident.email}</span>}
                      {resident.phone && <span>{resident.phone}</span>}
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={resident.isActive ? "secondary" : "outline"}>
                    {resident.isActive ? "Activo" : "Suspendido"}
                  </Badge>
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ResidentFormDialog
                        lots={lots}
                        resident={resident}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                          </Button>
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() => toggleActive(resident)}
                      >
                        {resident.isActive ? "Suspender" : "Reactivar"}
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
