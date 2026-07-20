import "server-only";
import type { AuthSession } from "@/modules/auth/server";
import { lotRepository } from "../repositories";
import { toLotOption } from "../mappers";
import type { LotOption } from "../types";

/** Lotes disponibles del tenant para asignar en el formulario de residente. */
export async function getLotOptions(
  session: AuthSession,
): Promise<LotOption[]> {
  const rows = await lotRepository.listOptions(session.tenantId);
  return rows.map(toLotOption);
}
