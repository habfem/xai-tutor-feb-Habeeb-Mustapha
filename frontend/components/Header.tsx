"use client";
import React from "react";

type Props = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onToggleMobile: () => void;
};

export default function Header({ collapsed, onToggleCollapse, onToggleMobile }: Props) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 rounded-md hover:bg-zinc-100"
          aria-label="Open sidebar"
        >
          ≡
        </button>

        <button
          onClick={onToggleCollapse}
          className="hidden md:inline-flex p-2 rounded-md hover:bg-zinc-100"
          aria-label="Collapse sidebar"
        >
          {collapsed ? '»' : '«'}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full" />
          <span className="font-semibold">Prodex</span>
        </div>
        <h1 className="ml-4 text-lg font-medium">Orders</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input placeholder="Search... (⌘K)" className="w-56 md:w-72 rounded-md border px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 bg-zinc-300 rounded-full" />
            <div className="w-8 h-8 bg-zinc-400 rounded-full" />
            <div className="w-8 h-8 bg-zinc-500 rounded-full flex items-center justify-center text-xs text-white">+2</div>
          </div>
          <div className="relative">
            <button className="p-2 rounded-full">🔔</button>
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </div>
          <div className="w-8 h-8 bg-zinc-200 rounded-full" />
        </div>
      </div>
    </header>
  );
}
