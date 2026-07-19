import { encryptText, decryptText } from "@/utils/encrypXOR";

const SESSION_KEY = "pos.session.v1";

export interface SessionConfig {
  role: string;
  token: string;
  username: string;
  clientId: string;
  employeeID: string;
  fullName?: string;
  companyName?: string;
}

function parseSession(raw: string): SessionConfig | null {
  try {
    return JSON.parse(raw) as SessionConfig;
  } catch {
    return null;
  }
}

class AuthService {
  private getRawSession(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(SESSION_KEY);
  }

  async getSession(): Promise<SessionConfig | null> {
    const raw = this.getRawSession();
    if (!raw) return null;

    const plain = parseSession(raw);
    if (plain) return plain;

    try {
      const decrypted = decryptText(raw);
      return parseSession(decrypted);
    } catch {
      return null;
    }
  }

  async setSession(session: SessionConfig): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      SESSION_KEY,
      encryptText(JSON.stringify(session)),
    );
  }

  async clearSession(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(SESSION_KEY);
  }

  async logout(): Promise<void> {
    await this.clearSession();
  }
}

export const authService = new AuthService();
