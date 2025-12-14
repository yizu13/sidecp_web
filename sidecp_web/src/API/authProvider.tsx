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
  role: string | null;
  user: user | undefined | null;
}

export default function Authsystem({ children }: props) {
  const [accessToken, setAccesToken] = useState<string | null>(null);
  const [refreshToken, setrefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<user | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigation = useNavigate();

  const sessionExpiredAlertShown = useRef(false);

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

      // también guardar en sessionStorage para compatibilidad
      sessionStorage.setItem("token", storedRefreshToken);
      sessionStorage.setItem("user", storedUser);
      sessionStorage.setItem("role", storedRole);
    }
  }, []);

  // Auto-refresh cada 10 minutos
  useEffect(() => {
    if (refreshToken && refreshToken !== 'refresh') {
      const autoCheck = setTimeout(async () => {
        try {
          const response = await axiosLog.post("/auth/token", { token: refreshToken });
          const newAccessToken = response.data.accessToken;
          setAccesToken(newAccessToken);
          localStorage.setItem("accessToken", newAccessToken);
        } catch (error) {
          console.error("Auto-refresh failed:", error);
        }
      }, 10 * 60 * 1000);

      return () => clearTimeout(autoCheck);
    }
  }, [refreshToken]);

  // Interceptores para axios
  useEffect(() => {
    const setupInterceptors = (instance: typeof axiosInstance) => {
      const requestInterceptor = instance.interceptors.request.use(config => {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      });

      const responseInterceptor = instance.interceptors.response.use(
        res => res,
        async err => {
          const originalRequest = err.config;
          if ((err.response?.status === 401 || err.response?.status === 402) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const currentRefreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("token");
              if (!currentRefreshToken) throw new Error("No refresh token available");

              const response = await axiosLog.post('/auth/token', { token: currentRefreshToken });
              const newAccessToken = response.data.accessToken;

              setAccesToken(newAccessToken);
              localStorage.setItem("accessToken", newAccessToken);

              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return instance(originalRequest);
            } catch (refreshError) {
              if (!sessionExpiredAlertShown.current) {
                sessionExpiredAlertShown.current = true;
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                setTimeout(() => (sessionExpiredAlertShown.current = false), 1000);
              }

              sessionStorage.clear();
              localStorage.clear();
              setAccesToken(null);
              setrefreshToken(null);
              setRole(null);
              setUser(null);
              navigation('/login');

              return Promise.reject(refreshError);
            }
          }
          return Promise.reject(err);
        }
      );

      return { requestInterceptor, responseInterceptor };
    };

    const axiosLogInterceptors = setupInterceptors(axiosLog);
    const axiosInstanceInterceptors = setupInterceptors(axiosInstance);

    return () => {
      axiosLog.interceptors.request.eject(axiosLogInterceptors.requestInterceptor);
      axiosLog.interceptors.response.eject(axiosLogInterceptors.responseInterceptor);
      axiosInstance.interceptors.request.eject(axiosInstanceInterceptors.requestInterceptor);
      axiosInstance.interceptors.response.eject(axiosInstanceInterceptors.responseInterceptor);
    };
  }, [navigation]);

  const login = useCallback(async (credentials: object) => {
    try {
      const response = await axiosLog.post("/auth/login", credentials);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = response.data;

      setAccesToken(newAccessToken);
      setrefreshToken(newRefreshToken);
      setRole(userData.role);
      setUser(userData);

      // Guardar en localStorage y sessionStorage
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);

      sessionStorage.setItem("token", newRefreshToken);
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("role", userData.role);

      sessionExpiredAlertShown.current = false;
    } catch (err) {
      setRole(null);
      setUser(null);
      throw err;
    }
  }, []);

  const memo = useMemo(() => ({
    login,
    role,
    user
  }), [login, user, role]);

  return <Auth.Provider value={memo}>{children}</Auth.Provider>;
}
