import { useState, useMemo } from "react";
import useSearch from "@/hooks/useSearch";
import type {
  FilterStatePagination,
  FilterValue,
  OrderingState,
  PaginatedGridConfig,
} from "../types";

interface UsePaginationProps<T> extends PaginatedGridConfig<T> {
  itemsPerPage?: number;
}

const usePagination = <T>({
  values,
  searchKey,
  filterConfigs = [],
  orderingConfigs = [],
  filterFn,
  orderingFn,
  deriveFilterOptions,
}: UsePaginationProps<T>) => {
  // Estados
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterStatePagination>({});
  const [ordering, setOrdering] = useState<OrderingState>({
    field: null,
    direction: null,
  });

  // Búsqueda
  const fields = useMemo(
    () => (typeof searchKey === "string" ? [searchKey] : searchKey),
    [searchKey]
  );
  const { filteredData, setQuery } = useSearch(values, { fields });

  // Derivar opciones de filtros automáticamente si es necesario
  const filterConfigsWithOptions = useMemo(() => {
    if (!deriveFilterOptions) return filterConfigs;

    return filterConfigs.map((config) => {
      if (
        (config.options ?? config.type === "range") ||
        config.type === "minmax"
      ) {
        return config;
      }

      return {
        ...config,
        options: deriveFilterOptions(config.name, values),
      };
    });
  }, [filterConfigs, values, deriveFilterOptions]);

  // Aplicar búsqueda → filtros → ordenamiento → paginar
  const processedItems = useMemo(() => {
    let result = [...filteredData];

    // 1. Aplicar filtros
    if (filterFn && Object.keys(filters).length > 0) {
      result = result.filter((item) => filterFn(item, filters));
    }

    // 2. Aplicar ordenamiento
    if (orderingFn && ordering.field) {
      result = orderingFn([...result], ordering);
    }

    return result;
  }, [filteredData, filters, ordering, filterFn, orderingFn]);

  // Paginar
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return processedItems.slice(startIndex, endIndex);
  }, [processedItems, currentPage, itemsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(processedItems.length / itemsPerPage),
    [processedItems.length, itemsPerPage]
  );

  // Setters con lógica
  const handleSetItemsPerPage = (number: number) => {
    setCurrentPage(1);
    setItemsPerPage(number);
  };

  const handleSetFilters = (
    filterName: string,
    value: FilterValue | FilterValue[]
  ) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (Array.isArray(value) && value.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete updated[filterName];
      } else {
        updated[filterName] = value;
      }
      return updated;
    });
    setCurrentPage(1); // Reset a página 1 al filtrar
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSetOrdering = (
    field: string | null,
    direction: "asc" | "desc" | null
  ) => {
    setOrdering({ field, direction });
    setCurrentPage(1); // Reset a página 1 al ordenar
  };

  const handleToggleOrdering = (field: string) => {
    if (ordering.field === field) {
      // Si es el mismo field, toggle direction
      if (ordering.direction === "asc") {
        handleSetOrdering(field, "desc");
      } else if (ordering.direction === "desc") {
        handleSetOrdering(null, null);
      }
    } else {
      // Nuevo field, comenzar con asc
      handleSetOrdering(field, "asc");
    }
  };

  return {
    currentItems,
    totalPages,
    currentPage,
    setCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    setQuery,
    filters,
    setFilters: handleSetFilters,
    clearFilters: handleClearFilters,
    ordering,
    setOrdering: handleSetOrdering,
    toggleOrdering: handleToggleOrdering,
    filterConfigsWithOptions,
    orderingConfigs,
    itemsPerPage,
  };
};

export default usePagination;
