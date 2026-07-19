// Función para convertir una cadena a hexadecimal
function toHex(str: string): string {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return hex;
}

// Función para convertir una cadena hexadecimal a texto
function fromHex(hex: string): string {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

// Función para encriptar la contraseña
export function encryptPassword(password: string): string {
  const key = process.env.XOR_KEY ?? "N/A";
  if (password.length !== 6) {
    throw new Error("La contraseña debe tener 6 caracteres");
  }

  let encryptedPassword = "";
  for (let i = 0; i < password.length; i++) {
    encryptedPassword += String.fromCharCode(
      password.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return toHex(encryptedPassword); // Convertir a hexadecimal para representación legible
}

const isEqual = (decryptedPassword: string, valueToValidate: string) =>
  decryptedPassword === valueToValidate;
// Función para desencriptar la contraseña
export function decryptPassword(encryptedHex: string) {
  const key = process.env.XOR_KEY ?? "N/A";
  const encryptedPassword = fromHex(encryptedHex); // Convertir de hexadecimal a texto
  let decryptedPassword = "";
  for (let i = 0; i < encryptedPassword.length; i++) {
    decryptedPassword += String.fromCharCode(
      encryptedPassword.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return {
    decryptedPassword,
    isEqual: (value: string) => isEqual(decryptedPassword, value),
  };
}

export function encryptText(str: string): string {
  let encryptedPassword = "";
  const key = process.env.XOR_KEY ?? "N/A";
  for (let i = 0; i < str.length; i++) {
    encryptedPassword += String.fromCharCode(
      str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return toHex(encryptedPassword); // Convertir a hexadecimal para representación legible
}

export function decryptText(encryptedHex: string): string {
  const key = process.env.XOR_KEY ?? "N/A";
  const encrypted = fromHex(encryptedHex);
  let decrypted = "";
  for (let i = 0; i < encrypted.length; i++) {
    decrypted += String.fromCharCode(
      encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return decrypted;
}
