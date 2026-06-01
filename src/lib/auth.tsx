import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "cidadao" | "admin";
export interface User {
  email: string;
  role: Role;
  nome: string;
}

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "cr.auth.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);


  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error("Informe e-mail e senha");
    const role: Role = email.toLowerCase().includes("admin") ? "admin" : "cidadao";
    const u: User = {
      email,
      role,
      nome: role === "admin" ? "Gestor Municipal" : "Cidadão Recifense",
    };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout, loading }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
