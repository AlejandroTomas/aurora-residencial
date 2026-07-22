"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Plus, ChevronRight } from "lucide-react";
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
import type { ActionResult } from "@/core/types";
import { NamedNodeDialog } from "./NamedNodeDialog";
import type { NamedNode } from "../types";

type NodeAction = (input: unknown) => Promise<ActionResult<unknown>>;

/**
 * Nivel genérico de la jerarquía para entidades con nombre (etapa/calle/manzana): lista +
 * crear + renombrar + activar/desactivar. Si se pasa `childBasePath`, cada fila enlaza a su
 * nivel hijo. Las acciones llegan por props (Server Actions) desde la página.
 */
export function StructureLevel({
  nodes,
  parentId,
  entityLabel,
  childBasePath,
  extraAction,
  createAction,
  renameAction,
  setActiveAction,
}: {
  nodes: NamedNode[];
  parentId?: string;
  entityLabel: string;
  // Prefijo de ruta del nivel hijo (string serializable, NO una función: un Server
  // Component no puede pasar funciones normales a un Client Component). El enlace es
  // `${childBasePath}/${id}`.
  childBasePath?: string;
  // Acción extra opcional junto al botón "Nueva …" (ej. alta por grupos).
  extraAction?: ReactNode;
  createAction: NodeAction;
  renameAction: NodeAction;
  setActiveAction: NodeAction;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const toggle = (node: NamedNode) => {
    setPendingId(node.id);
    startTransition(async () => {
      const result = await setActiveAction({
        id: node.id,
        isActive: !node.isActive,
      });
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(node.isActive ? "Desactivado." : "Activado.");
        router.refresh();
      }
      setPendingId(null);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        {extraAction}
        <NamedNodeDialog
          entityLabel={entityLabel}
          parentId={parentId}
          createAction={createAction}
          renameAction={renameAction}
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              Nueva {entityLabel}
            </Button>
          }
        />
      </div>

      {nodes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay registros todavía. Crea la primera {entityLabel}.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => {
                const busy = pendingId === node.id;
                return (
                  <TableRow key={node.id}>
                    <TableCell className="font-medium">
                      {childBasePath ? (
                        <Link
                          href={`${childBasePath}/${node.id}`}
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          {node.name}
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                      ) : (
                        node.name
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={node.isActive ? "secondary" : "outline"}>
                        {node.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <NamedNodeDialog
                          entityLabel={entityLabel}
                          node={node}
                          createAction={createAction}
                          renameAction={renameAction}
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
                          onClick={() => toggle(node)}
                        >
                          {node.isActive ? "Desactivar" : "Activar"}
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
