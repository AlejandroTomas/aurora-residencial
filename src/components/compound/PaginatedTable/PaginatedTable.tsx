import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  // ArrowUpDown
} from "lucide-react";

// Asume que importas tus hooks y tipos desde tus carpetas correspondientes
import usePagination from "./hooks/usePagination";
import type { PaginatedGridConfig } from "./types";

interface PaginatedTableProps<T> extends PaginatedGridConfig<T> {
  columns: {
    header: string;
    className?: string;
    render: (item: T) => React.ReactNode;
  }[];
  props?: any;
  extraActions?: React.ReactNode;
}

export default function PaginatedTable<T>({
  values,
  searchKey,
  columns,
  filterConfigs = [],
  orderingConfigs = [],
  filterFn,
  orderingFn,
  deriveFilterOptions,
  extraActions,
}: PaginatedTableProps<T>) {
  const {
    currentItems,
    currentPage,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    setQuery,
    filters,
    setFilters,
    clearFilters,
    ordering,
    toggleOrdering,
    filterConfigsWithOptions,
    itemsPerPage,
  } = usePagination({
    values,
    searchKey,
    filterConfigs,
    orderingConfigs,
    filterFn,
    orderingFn,
    deriveFilterOptions,
  });

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
    },
    [setCurrentPage],
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setCurrentPage(1);
    },
    [setQuery, setCurrentPage],
  );

  const hasActiveFilters = Object.keys(filters).length > 0;
  const hasActiveOrdering = ordering.field !== null;

  return (
    <div className="w-full space-y-4">
      {/* Toolbar: Búsqueda y Filtros */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">
        {/* Buscador + Acciones Extras */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center flex-1 min-w-0">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Buscar..."
              onChange={handleSearchChange}
              className="h-10 w-full border-white/10 bg-black/20"
            />
          </div>

          {/* Contenedor de acciones extras con control de desbordamiento horizontal en móviles */}
          {extraActions && (
            <div className="flex items-center gap-2 max-w-full overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x">
              {extraActions}
            </div>
          )}
        </div>

        {/* Botón de Filtros (Si existe) */}
        {filterConfigsWithOptions.length > 0 && (
          <div className="shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant={hasActiveFilters ? "default" : "outline"}
                  className="rounded-xl gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                  {hasActiveFilters && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-white/20 text-white"
                    >
                      {Object.keys(filters).length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-slate-900 text-slate-100 border-white/10"
              >
                <SheetHeader>
                  <SheetTitle className="text-white">
                    Filtros Avanzados
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  {/* Aquí renderizas tu componente FilterPanel adaptado o inputs nativos */}
                  <Button
                    variant="destructive"
                    onClick={() => clearFilters()}
                    className="w-full mt-4"
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>

      {/* Barra de Ordenamiento (Chips Activos) */}
      {(hasActiveFilters || hasActiveOrdering) && (
        <div className="flex flex-wrap gap-2 items-center">
          {hasActiveOrdering && (
            <Badge
              variant="outline"
              className="bg-cyan-500/10 text-cyan-200 border-cyan-500/20 px-2 py-1"
            >
              📊{" "}
              {orderingConfigs.find((c) => c.field === ordering.field)?.label}{" "}
              {ordering.direction === "asc" ? "↑" : "↓"}
            </Badge>
          )}
          {Object.entries(filters).map(([key, value]) => (
            <Badge
              key={key}
              variant="outline"
              className="bg-emerald-500/10 text-emerald-200 border-emerald-500/20 px-2 py-1"
            >
              {key}: {Array.isArray(value) ? value.join(", ") : String(value)}
            </Badge>
          ))}
        </div>
      )}

      <Separator className="bg-white/10" />

      {/* Paginación Superior */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="rounded-xl"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span>Página</span>
          <Input
            type="number"
            className="w-14 h-8 bg-black/20 border-white/10 text-center p-1"
            value={currentPage}
            onChange={(e) => {
              const newPage = Number(e.target.value);
              if (newPage > 0 && newPage <= totalPages)
                handlePageChange(newPage);
            }}
          />
          <span>
            de <strong className="text-white">{totalPages}</strong>
          </span>
        </div>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="rounded-xl"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        <Select
          value={String(itemsPerPage)}
          onValueChange={(val) => setItemsPerPage(Number(val))}
        >
          <SelectTrigger className="w-[100px] h-8 bg-black/20 border-white/10">
            <SelectValue placeholder={itemsPerPage} />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-white">
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de Shadcn */}
      <div className="rounded-3xl border border-white/10 bg-black/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              {columns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className={`px-4 text-slate-400 ${col.className || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item, rowIdx) => (
                <TableRow
                  key={rowIdx}
                  className="border-white/10 odd:bg-white/5 even:bg-transparent hover:bg-white/5 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <TableCell
                      key={colIdx}
                      className={`px-4 ${col.className || ""}`}
                    >
                      {col.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/10">
                <TableCell
                  className="px-4 text-slate-300 text-center py-10"
                  colSpan={columns.length}
                >
                  No hay resultados que coincidan con tus criterios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
