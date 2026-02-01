"use client";
import React, { useEffect, useState } from "react";

type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  order_date: string;
  status: string;
  total_amount: number;
  payment_status: string;
};

export default function OrdersTable() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  async function fetchOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders?limit=${limit}&offset=${(page - 1) * limit}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function toggle(id: number) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function toggleAll() {
    if (selected.length === orders.length) setSelected([]);
    else setSelected(orders.map((o) => o.id));
  }

  async function handleBulkDelete() {
    if (!selected.length) return;
    await fetch(`${API_BASE}/orders/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    });
    setSelected([]);
    fetchOrders();
  }

  async function handleBulkDuplicate() {
    if (!selected.length) return;
    await fetch(`${API_BASE}/orders/bulk/duplicate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    });
    setSelected([]);
    fetchOrders();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 rounded border">Bulk Update Status</button>
          <button className="px-3 py-2 rounded border">Export Orders</button>
          <button className="px-3 py-2 rounded bg-black text-white">+ Add Orders</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 rounded border">All</button>
          <button className="px-3 py-2 rounded border">Incomplete</button>
          <button className="px-3 py-2 rounded border">Overdue</button>
          <button className="px-3 py-2 rounded border">Ongoing</button>
          <button className="px-3 py-2 rounded border">Finished</button>
        </div>
      </div>

      {/* Mobile list view */}
      <div className="block md:hidden space-y-3">
        {orders.map((o) => (
          <div key={o.id} className={`p-3 rounded-lg border bg-white ${selected.includes(o.id) ? 'bg-zinc-100' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} />
                <div>
                  <div className="text-sm font-medium">{o.order_number}</div>
                  <div className="text-xs text-zinc-500">{o.customer_name}</div>
                </div>
              </div>
              <div className="text-sm">${o.total_amount.toFixed(2)}</div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-600">
              <div className="flex items-center gap-2"><span className={`px-2 py-1 rounded ${o.status==='Pending'?'bg-yellow-100':o.status==='Completed'?'bg-green-100':'bg-red-100'}`}>{o.status}</span><span>{o.payment_status}</span></div>
              <div className="text-xs">{new Date(o.order_date).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[800px] table-auto border-collapse bg-white">
          <thead>
            <tr className="text-left">
              <th className="p-3"><input type="checkbox" onChange={toggleAll} checked={selected.length === orders.length && orders.length>0} /></th>
              <th className="p-3">Order Number</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Order Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className={`${selected.includes(o.id) ? 'bg-zinc-100' : ''}`}>
                <td className="p-3"><input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} /></td>
                <td className="p-3">{o.order_number}</td>
                <td className="p-3 flex items-center gap-2"> <div className="w-8 h-8 bg-zinc-200 rounded-full" /> {o.customer_name}</td>
                <td className="p-3">{new Date(o.order_date).toLocaleString()}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded ${o.status==='Pending'?'bg-yellow-100':o.status==='Completed'?'bg-green-100':'bg-red-100'}`}>{o.status}</span></td>
                <td className="p-3">${o.total_amount.toFixed(2)}</td>
                <td className="p-3">{o.payment_status}</td>
                <td className="p-3">•••</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-500">Showing {orders.length ? 1 + (page - 1) * limit : 0}-{(page - 1) * limit + orders.length} of {orders.length}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 border rounded">Prev</button>
          <div className="flex gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`px-2 py-1 rounded ${page === i + 1 ? 'bg-black text-white' : 'border'}`}>{i + 1}</button>
            ))}
            <span className="px-2 py-1">...</span>
            <button onClick={() => setPage(12)} className={`px-2 py-1 rounded ${page === 12 ? 'bg-black text-white' : 'border'}`}>12</button>
          </div>
          <button onClick={() => setPage((p) => p + 1)} className="px-2 py-1 border rounded">Next</button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg p-3 flex items-center gap-3">
          <div className="font-medium">{selected.length} Selected</div>
          <button onClick={handleBulkDuplicate} className="px-3 py-1 border rounded">Duplicate</button>
          <button className="px-3 py-1 border rounded">Print</button>
          <button onClick={handleBulkDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
          <button onClick={() => setSelected([])} className="px-2 py-1">Close</button>
        </div>
      )}
    </div>
  );
}
