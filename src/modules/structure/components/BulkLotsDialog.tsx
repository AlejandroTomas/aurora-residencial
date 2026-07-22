"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Layers, Loader2 } from "lucide-react";
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
import { LOT_STATUSES, LOT_STATUS_LABELS } from "../constants";
import { createLotsBulkAction } from "../actions";
import type { LotStatus } from "@/core/supabase";

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30";

export function BulkLotsDialog({ blockId }: { blockId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [from, setFrom] = useState("1");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<LotStatus>("DISPONIBLE");
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      const result = await createLotsBulkAction({
        blockId,
        prefix,
        from,
        to,
        status,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      const { created, skipped } = result.data;
      toast.success(
        `Se crearon ${created} lotes${skipped > 0 ? ` (${skipped} ya existían)` : ""}.`,
      );
      setTo("");
      setPrefix("");
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Layers className="h-4 w-4" />
          Crear varios
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear varios lotes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="bulk-prefix">Prefijo (opcional)</Label>
              <Input
                id="bulk-prefix"
                placeholder="A-"
                value={prefix}
                onChange={(event) => setPrefix(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-from">Desde</Label>
              <Input
                id="bulk-from"
                type="number"
                min={1}
                value={from}
                onChange={(event) => setFrom(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-to">Hasta</Label>
              <Input
                id="bulk-to"
                type="number"
                min={1}
                value={to}
                onChange={(event) => setTo(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-status">Estado</Label>
            <select
              id="bulk-status"
              className={SELECT_CLASS}
              value={status}
              onChange={(event) => setStatus(event.target.value as LotStatus)}
            >
              {LOT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {LOT_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-muted-foreground">
            Ej.: prefijo «A-», del 1 al 20 → A-1 … A-20. Se omiten los números que
            ya existan en la manzana.
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" disabled={isPending} onClick={submit}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
