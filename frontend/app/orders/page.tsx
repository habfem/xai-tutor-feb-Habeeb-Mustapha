"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import StatsCards from "../../components/StatsCards";
import OrdersTable from "../../components/OrdersTable";

export default function OrdersPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, shipped: 0, refunded: 0 });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  async function fetchStats() {
    try {
      const res = await fetch(`${API_BASE}/orders?limit=1000`);
      const data = await res.json();
      const orders = data.orders || [];
      const total = orders.length;
      const pending = orders.filter((o: any) => o.status === "Pending").length;
      const refunded = orders.filter((o: any) => o.status === "Refunded").length;
      const shipped = total - pending - refunded;
      setStats({ total, pending, shipped, refunded });
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onToggleMobile={() => setMobileOpen((m) => !m)}
      />
      <div className="flex flex-col md:flex-row">
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <StatsCards stats={stats} />
          </div>
          <div className="bg-white p-2 md:p-4 rounded-lg border overflow-x-auto">
            <OrdersTable />
          </div>
        </main>
      </div>
    </div>
  );
}
