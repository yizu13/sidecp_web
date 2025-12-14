import { type ReactNode, useState, useMemo, useEffect, useCallback, useRef } from "react";
import React from "react";
import { Auth } from "./Contextauth";
import axiosLog from './AxiosLogServer';
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosServer";

type props = { children: ReactNode };

type user = {
  email: string;
  lastname: string;
  name: string;
  role: string;
};

export interface userProps {
  login: (data: object) => Promise<void>;
  logout: () => void;
  role: string | null;
  user: user | undefined | null;
}

// Variables globales para refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export default function Authsystem({ children }: props) {
  const [accessToken, setAccesToken] = useState<string | null>(null);
  const [refreshToken, setrefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<user | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigation = useNavigate();

  const sessionExpiredAlertShown = useRef(false);
  const interceptorSetup = useRef(false);

  // Inicializar datos desde storage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedAccessToken && storedRefreshToken && storedUser && storedRole) {
      setAccesToken(storedAccessToken);
      setrefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      console.log("✅ Sesión restaurada desde localStorage");
    }
  }, []);

  // Función de logout con useRef para evitar re-creación
  const logoutRef = useRef<() => void>();
 
  logoutRef.current = () => {
    if (!sessionExpiredAlertShown.current) {
      sessionExpiredAlertShown.current = true;
      alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      setTimeout(() => (sessionExpiredAlertShown.current = false), 1000);
    }

    localStorage.clear();
    localStorage.clear();
    setAccesToken(null);
    setrefreshToken(null);
    setRole(null);
    setUser(null);
    navigation('/login');
    console.log("🚪 Logout completado");
  };

  const logout = useCallback(() => {
    logoutRef.current?.();
  }, []);

  // Interceptor de response - SIN DEPENDENCIAS
  useEffect(() => {
    if (interceptorSetup.current) return;
    interceptorSetup.current = true;

    const responseInterceptor = axiosInstance.interceptors.response.use(
      response => response,
      async (err) => {
        const originalRequest = err.config;

        // Solo manejar 401/402
        if (err.response?.status !== 401 && err.response?.status !== 402) {
          return Promise.reject(err);
        }

        // Si ya se intentó, hacer logout
        if (originalRequest._retry) {
          console.error("⛔ Refresh falló, haciendo logout");
          logoutRef.current?.();
          return Promise.reject(err);
        }

        // Si ya está refrescando, agregar a cola
        if (isRefreshing) {
          console.log("⏳ Agregando a cola de refresh");
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const currentRefreshToken = localStorage.getItem("refreshToken");
         
          if (!currentRefreshToken) {
            throw new Error("No refresh token");
          }

          console.log("🔄 Refrescando access token...");
         
          const response = await axiosLog.post('/auth/token', {
            token: currentRefreshToken
          });
         
          const newAccessToken = response.data.accessToken;

          localStorage.setItem("accessToken", newAccessToken);
          setAccesToken(newAccessToken);

          console.log("✅ Token refrescado");

          processQueue(null, newAccessToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          console.error("❌ Refresh token falló:", refreshError);
          processQueue(refreshError, null);
          logoutRef.current?.();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    );

    console.log("✅ Response interceptor configurado (PERMANENTE)");

    // Solo limpiar al desmontar el componente principal
    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
      interceptorSetup.current = false;
      console.log("🧹 Interceptor limpiado (componente desmontado)");
    };
  }, []); // ← SIN DEPENDENCIAS

  const login = useCallback(async (credentials: object) => {
    try {
      const response = await axiosLog.post("/auth/login", credentials);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = response.data;

      setAccesToken(newAccessToken);
      setrefreshToken(newRefreshToken);
      setRole(userData.role);
      setUser(userData);

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);

      sessionExpiredAlertShown.current = false;
     
      console.log("✅ Login exitoso");
    } catch (err) {
      console.error("❌ Login falló:", err);
      setRole(null);
      setUser(null);
      throw err;
    }
  }, []);

  const memo = useMemo(() => ({
    login,
    logout,
    role,
    user
  }), [login, logout, user, role]);

  return <Auth.Provider value={memo}>{children}</Auth.Provider>;
}

