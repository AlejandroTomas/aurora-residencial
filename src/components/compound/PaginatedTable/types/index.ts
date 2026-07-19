export type FilterValue = string | number | boolean;

export type FilterStatePagination = Record<string, FilterValue | FilterValue[] | { min?: number; max?: number }>;

export interface OrderingState {
  field: string | null;
  direction: 'asc' | 'desc' | null;
}

export type FilterType = 'checkbox' | 'radio' | 'range' | 'minmax';

export interface FilterOption {
  label: string;
  value: FilterValue;
}

export interface FilterConfigPagination {
  name: string; // Clave del field en el objeto (ej: "brand", "status")
  label: string; // Etiqueta visible (ej: "Marca")
  type: FilterType;
  options?: FilterOption[]; // Para checkbox/radio
  minMax?: { min: number; max: number }; // Para range/minmax
}

export interface OrderingConfig {
  name: string; // Identificador único
  label: string; // Etiqueta visible (ej: "Inventario")
  field: string; // Campo del objeto a ordenar
}

export interface PaginatedGridConfig<T> {
  values: T[];
  searchKey: string | string[];
  filterConfigs?: FilterConfigPagination[];
  orderingConfigs?: OrderingConfig[];

  // Funciones de lógica de negocio (inyectadas)
  filterFn?: (item: T, filters: FilterStatePagination) => boolean;
  orderingFn?: (items: T[], ordering: OrderingState) => T[];

  // Para derivar opciones de filtros automáticamente
  deriveFilterOptions?: (field: string, values: T[]) => FilterOption[];
}