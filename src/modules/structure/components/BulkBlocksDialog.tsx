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
import { Label } from "@/components/ui/label";
import { createBlocksBulkAction } from "../actions";

const TEXTAREA_CLASS =
  "min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30";

export function BulkBlocksDialog({ streetId }: { streetId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    const names = text
      .split(/[\n,]+/)
      .map((value) => value.trim())
      .filter(Boolean);
    if (names.length === 0) {
      toast.error("Ingresa al menos un nombre.");
      return;
    }
    startTransition(async () => {
      const result = await createBlocksBulkAction({
        parentId: streetId,
        names,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`Se crearon ${result.data.created} manzanas.`);
      setText("");
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Layers className="h-4 w-4" />
          Crear varias
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear varias manzanas</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="bulk-blocks">
            Nombres (uno por línea o separados por coma)
          </Label>
          <textarea
            id="bulk-blocks"
            className={TEXTAREA_CLASS}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={"A\nB\nC"}
          />
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
