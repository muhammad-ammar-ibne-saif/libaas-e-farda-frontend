"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { adminLogin as apiLogin, adminMe } from "../../lib/adminApi";
import { useRouter } from "next/navigation";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("lef_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    adminMe()
      .then((data) => {
        if (data.success) setAdmin(data.admin);
        else localStorage.removeItem("lef_admin_token");
      })
      .catch(() => localStorage.removeItem("lef_admin_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    if (!data.success) throw new Error(data.message || "Login failed");
    localStorage.setItem("lef_admin_token", data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("lef_admin_token");
    setAdmin(null);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
