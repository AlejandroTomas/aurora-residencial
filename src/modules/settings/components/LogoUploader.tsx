"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadLogoAction } from "../actions";

export function LogoUploader({ logoUrl }: { logoUrl: string | null }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const upload = () => {
    if (!file) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("logo", file);
      const result = await uploadLogoAction(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Logotipo actualizado.");
      setFile(null);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt="Logotipo del fraccionamiento"
          className="h-16 w-16 rounded-lg border border-border bg-card object-contain"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border text-center text-[10px] text-muted-foreground">
          Sin logo
        </div>
      )}

      <div className="space-y-2">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium"
        />
        <div className="flex items-center gap-3">
          <Button type="button" disabled={!file || isPending} onClick={upload}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Subir logotipo
          </Button>
          <span className="text-xs text-muted-foreground">
            PNG, JPG o WEBP. Máx. 5 MB.
          </span>
        </div>
      </div>
    </div>
  );
}
