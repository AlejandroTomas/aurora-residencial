import "server-only";
import { publicRegistrationRepository } from "../repositories";
import { toRegistrationLotOption } from "../mappers";
import type { RegistrationContext } from "../types";

/**
 * Contexto público de la pantalla de registro para un fraccionamiento (por slug).
 * Devuelve `null` si el slug no corresponde a un tenant activo.
 */
export async function getRegistrationContext(
  slug: string,
): Promise<RegistrationContext | null> {
  const tenant = await publicRegistrationRepository.findActiveTenantBySlug(slug);
  if (!tenant) return null;

  const lots = await publicRegistrationRepository.listLotOptions(tenant.id);
  return {
    tenantName: tenant.name,
    lots: lots.map(toRegistrationLotOption),
  };
}
