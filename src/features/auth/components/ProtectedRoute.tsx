import { LoadingState } from "@/components/feedback/States";
import { useGetUserProfileQuery } from "@/services/userApiSlice";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  const {
    data: userProfile,
    isLoading,
    isFetching,
    isError,
  } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Wait until the initial authentication check finishes.
  if (isLoading || isFetching) {
    return <LoadingState label="Loading..." />;
  }

  // A failed profile request means the user isn't authenticated.
  if (isError || !userProfile) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
