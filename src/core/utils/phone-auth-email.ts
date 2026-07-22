// Supabase Auth exige un identificador único (correo o teléfono). Para permitir que los
// residentes usen "teléfono + contraseña" sin correo real, se deriva un correo SINTÉTICO
// determinista a partir del teléfono. Este correo NUNCA se usa para enviar nada: es solo el
// identificador interno. El residente solo ve/usa su teléfono.
const PHONE_AUTH_DOMAIN = "residente.fraccionamiento.app";

/** Convierte un teléfono en el correo sintético interno (solo dígitos + dominio fijo). */
export function phoneToAuthEmail(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `${digits}@${PHONE_AUTH_DOMAIN}`;
}

/** `true` si el correo es uno sintético de teléfono (para no mostrarlo ni enviarle correos). */
export function isPhoneAuthEmail(email: string): boolean {
  return email.endsWith(`@${PHONE_AUTH_DOMAIN}`);
}
