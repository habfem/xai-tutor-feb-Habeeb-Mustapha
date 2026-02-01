"use client";
import React from "react";

export default function StatsCards({ stats }: { stats: { total: number; pending: number; shipped: number; refunded: number } }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-lg border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500">Total Orders This Month</div>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </div>
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500">Pending Orders</div>
            <div className="text-2xl font-semibold">{stats.pending}</div>
          </div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500">Shipped Orders</div>
            <div className="text-2xl font-semibold">{stats.shipped}</div>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500">Refunded Orders</div>
            <div className="text-2xl font-semibold">{stats.refunded}</div>
          </div>
          <div className="w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
