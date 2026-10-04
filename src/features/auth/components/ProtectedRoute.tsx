import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useGetUserProfileQuery } from "@/services/userApiSlice";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: userProfile, isLoading } = useGetUserProfileQuery();
  if (!userProfile && !isLoading) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
