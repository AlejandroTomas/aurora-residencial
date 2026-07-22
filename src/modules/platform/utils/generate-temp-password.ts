import "server-only";
import { randomInt } from "crypto";

// Sin caracteres ambiguos (I, O, l, 0, 1) para que sea fácil de dictar/copiar.
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnpqrstuvwxyz";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%*?";
const ALL = UPPER + LOWER + DIGITS + SYMBOLS;

function pick(chars: string): string {
  return chars[randomInt(chars.length)];
}

/**
 * Genera una contraseña temporal segura (aleatoria) con al menos una mayúscula, minúscula,
 * dígito y símbolo. Se entrega una sola vez a quien provisiona; el admin la cambia después.
 */
export function generateTempPassword(length = 12): string {
  const required = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SYMBOLS)];
  const rest = Array.from({ length: Math.max(0, length - required.length) }, () =>
    pick(ALL),
  );
  const chars = [...required, ...rest];

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}
