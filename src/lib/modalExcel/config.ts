import type { ImportActionConfig } from "@/types";

export const importActions: ImportActionConfig[] = [
  {
    value: "productos",
    label: "Productos",
    description: "Alta o actualizacion masiva de productos por codigo de barras",
    icon: "📦",
    color: "cyan",
    fields: [
      { key: "codigoBarras", label: "Codigo de barras", type: "string", required: false },
      { key: "nombre", label: "Nombre", type: "string", required: true },
      { key: "categoria", label: "Categoria", type: "string", required: true },
      { key: "precioCosto", label: "Precio costo", type: "number", required: true },
      { key: "precioVenta", label: "Precio venta", type: "number", required: true },
      { key: "stockActual", label: "Stock actual", type: "number", required: false, defaultValue: 0 },
      { key: "stockMinimo", label: "Stock minimo", type: "number", required: false, defaultValue: 0 },
      {
        key: "unidadMedida",
        label: "Unidad de medida",
        type: "enum",
        required: true,
        enumOptions: [
          { value: "pieza", label: "Pieza" },
          { value: "kg", label: "Kg" },
          { value: "litro", label: "Litro" },
          { value: "metro", label: "Metro" },
        ],
      },
      {
        key: "activo",
        label: "Activo",
        type: "boolean",
        required: false,
        defaultValue: true,
        helpText: "Acepta: si/no, true/false, 1/0",
      },
    ],
  },
  {
    value: "clientes",
    label: "Clientes",
    description: "Alta masiva de clientes",
    icon: "👤",
    color: "indigo",
    fields: [
      { key: "nombre", label: "Nombre", type: "string", required: true },
      { key: "telefono", label: "Telefono", type: "string", required: false },
      { key: "email", label: "Email", type: "string", required: false },
      { key: "rfc", label: "RFC", type: "string", required: false },
      {
        key: "tipoCliente",
        label: "Tipo de cliente",
        type: "enum",
        required: true,
        enumOptions: [
          { value: "normal", label: "Normal" },
          { value: "mayoreo", label: "Mayoreo" },
          { value: "contratista", label: "Contratista" },
        ],
      },
      { key: "saldoCredito", label: "Saldo credito", type: "number", required: false, defaultValue: 0 },
      { key: "limiteCredito", label: "Limite credito", type: "number", required: false },
      { key: "activo", label: "Activo", type: "boolean", required: false, defaultValue: true },
    ],
  },
];