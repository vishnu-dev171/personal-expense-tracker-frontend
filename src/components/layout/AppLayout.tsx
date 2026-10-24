import {
  useGetUserProfileQuery,
  useLogoutUserMutation,
} from "@/services/userApiSlice";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/categories": "Categories",
  "/budgets": "Budgets",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useGetUserProfileQuery();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  const title = titleMap[location.pathname] ?? "Dashboard";

  async function handleLogout() {
    try {
      await logoutUser().unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <div className="flex min-h-screen max-w-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 flex-col md:ml-64 overflow-hidden">
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          userName={data?.user?.name ?? "User"}
          onLogout={handleLogout}
          loading={isLoggingOut}
        />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
