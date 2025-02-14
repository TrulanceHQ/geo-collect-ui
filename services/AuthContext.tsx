"use Client";

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { login as loginApi } from "./apiService";

interface AuthContextProps { 
  user: any;
  token: string | null;
  login: (emailAddress: string, password: string) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Load token from localStorage when the app starts
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setIsMounted(true);
  }, []);

  const login = async (emailAddress: string, password: string) => {
    const { accessToken, user } = await loginApi(emailAddress, password);
    setToken(accessToken);
    setUser(user);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (isMounted) {
      router.push("/"); // Redirect to the login page or home page
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;