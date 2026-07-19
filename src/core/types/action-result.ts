/**
 * Contrato de retorno de toda Server Action.
 *
 * Las Actions nunca lanzan errores hacia la UI: capturan los errores tipados del
 * dominio y devuelven un resultado explícito. Así el cliente siempre recibe una
 * forma predecible y nunca un mensaje interno (security.md: "No mostrar mensajes internos").
 */
export type ActionResult<TData = null> =
  | { success: true; data: TData }
  | { success: false; error: string };
