/**
 * DTO del tenant expuesto a la UI. Nunca se envían filas crudas de PostgreSQL
 * (architecture.md); solo lo que la interfaz necesita.
 */
export interface TenantDto {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}
