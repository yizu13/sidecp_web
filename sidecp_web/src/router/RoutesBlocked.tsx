import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type props = {
    children: ReactNode
}

export function AdminRoute({ children }: props) {
  const role = sessionStorage.getItem("role")
  console.log(role)

  if (role !== "admin") {
    return <Navigate to="/dashboard/inicio" replace />;
  }

  return children;
}