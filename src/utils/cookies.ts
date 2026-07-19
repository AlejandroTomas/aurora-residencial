// cookies-client.ts
import { encryptText, decryptText } from "./encrypXOR";

export function setCookie(name: string, value: string, days: number = 7): void {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  const encryptedValue = encryptText(value);
  document.cookie = `${name}=${encodeURIComponent(
    encryptedValue
  )}${expires}; path=/`;
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(nameEQ)) {
      const raw = cookie.substring(nameEQ.length, cookie.length);
      try {
        const encryptedValue = decodeURIComponent(raw);
        return decryptText(encryptedValue);
      } catch (e) {
        console.error("Error decrypting cookie", e);
        return null;
      }
    }
  }
  return null;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
