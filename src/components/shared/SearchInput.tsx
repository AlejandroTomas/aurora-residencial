"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Búsqueda por URL (`?q=`). Al enviar reinicia la paginación (`page`) para no quedar en
 * una página inexistente del nuevo resultado. Sin `useEffect`: la búsqueda ocurre al
 * enviar el formulario (Enter o botón), y el servidor re-consulta con el nuevo query.
 */
export function SearchInput({
  placeholder = "Buscar…",
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("q") ?? "";

  const navigate = (q: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get("q");
        navigate(String(value ?? "").trim());
      }}
      className="flex gap-2"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          key={current}
          name="q"
          defaultValue={current}
          placeholder={placeholder}
          className="pl-8"
          aria-label="Buscar"
        />
      </div>
      <Button type="submit" variant="outline">
        Buscar
      </Button>
      {current && (
        <Button type="button" variant="ghost" onClick={() => navigate("")}>
          Limpiar
        </Button>
      )}
    </form>
  );
}
