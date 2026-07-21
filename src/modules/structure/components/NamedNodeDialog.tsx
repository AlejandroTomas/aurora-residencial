"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/core/types";
import { renameNodeSchema } from "../schemas";
import type { NamedNode } from "../types";

type NodeAction = (input: unknown) => Promise<ActionResult<unknown>>;

const nameSchema = renameNodeSchema.pick({ name: true });
type NameInput = { name: string };

/**
 * Diálogo reutilizable para crear o renombrar un nivel con nombre (etapa/calle/manzana).
 * En modo crear envía `{ name, parentId }`; en modo renombrar, `{ id, name }`.
 */
export function NamedNodeDialog({
  trigger,
  entityLabel,
  parentId,
  node,
  createAction,
  renameAction,
}: {
  trigger: ReactNode;
  entityLabel: string;
  parentId?: string;
  node?: NamedNode;
  createAction: NodeAction;
  renameAction: NodeAction;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isRename = Boolean(node);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NameInput>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: node?.name ?? "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      isRename && node
        ? await renameAction({ id: node.id, name: values.name })
        : await createAction({ name: values.name, parentId });

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(isRename ? "Cambios guardados." : "Registro creado.");
    setOpen(false);
    if (!isRename) reset();
    router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isRename ? `Editar ${entityLabel}` : `Nueva ${entityLabel}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="node-name">Nombre</Label>
            <Input
              id="node-name"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
