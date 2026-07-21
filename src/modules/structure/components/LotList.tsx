"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
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
import { LotFormDialog } from "./LotFormDialog";
import { setLotActiveAction } from "../actions";
import { LOT_STATUS_LABELS } from "../constants";
import type { LotDto } from "../types";

export function LotList({
  lots,
  blockId,
}: {
  lots: LotDto[];
  blockId: string;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const toggle = (lot: LotDto) => {
    setPendingId(lot.id);
    startTransition(async () => {
      const result = await setLotActiveAction({
        id: lot.id,
        isActive: !lot.isActive,
      });
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(lot.isActive ? "Lote desactivado." : "Lote activado.");
        router.refresh();
      }
      setPendingId(null);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <LotFormDialog
          blockId={blockId}
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              Nuevo lote
            </Button>
          }
        />
      </div>

      {lots.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay lotes en esta manzana todavía.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lots.map((lot) => {
                const busy = pendingId === lot.id;
                return (
                  <TableRow key={lot.id}>
                    <TableCell className="font-medium">{lot.number}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {lot.area != null ? `${lot.area} m²` : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {LOT_STATUS_LABELS[lot.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={lot.isActive ? "secondary" : "outline"}>
                        {lot.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <LotFormDialog
                          blockId={blockId}
                          lot={lot}
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
                          onClick={() => toggle(lot)}
                        >
                          {lot.isActive ? "Desactivar" : "Activar"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
