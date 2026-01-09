import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import React from "react";
import useAuthContext from "../API/Contextauth";

type props = {
    children: ReactNode
}

export default function ProtectedRoute({ children }: props) {
  // Usar el contexto en lugar de sessionStorage
  const { user } = useAuthContext();
 
  // Fallback a localStorage si el contexto no está listo
  const storedUser = localStorage.getItem("user");

  if (!user && !storedUser) {
    console.log("⛔ No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}