import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import React from "react";

type props = {
    children: ReactNode
}

export default function ProtectedRoute({ children }: props) {
  const user = sessionStorage.getItem("user")

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}