"use client";
import React from "react";

function NavItem({ label, icon, active, collapsed }: { label: string; icon?: React.ReactNode; active?: boolean; collapsed?: boolean }) {
  return (
    <div
      title={label}
      className={`flex items-center ${collapsed ? 'justify-center' : ''} px-4 py-2 rounded-md hover:bg-zinc-100 ${active ? 'bg-zinc-100 font-medium' : ''}`}
    >
      {collapsed ? (
        <div className="w-8 h-8 flex items-center justify-center rounded-md" aria-hidden>
          {icon ?? label.charAt(0)}
        </div>
      ) : (
        <>
          <div className="w-6 mr-3 flex items-center justify-center text-sm text-zinc-600">{icon ?? label.charAt(0)}</div>
          <div>{label}</div>
        </>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }: { collapsed: boolean; mobileOpen: boolean; onCloseMobile: () => void }) {
  // Desktop width changes based on collapsed state
  const desktopClass = collapsed ? 'w-16' : 'w-72';

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`${desktopClass} hidden md:block border-r bg-white transition-all duration-150`}>
        <div className="p-3">
          <div className="mb-4">
            <div className={`text-sm text-zinc-500 ${collapsed ? 'text-center' : ''}`}>Workspace</div>
            {!collapsed && <div className="mt-2 p-2 rounded-md border">Uxerflow ▾</div>}
          </div>

          <nav className="space-y-1">
            <NavItem label="Dashboard" icon={<span>🏠</span>} collapsed={collapsed} />
            <NavItem label="Products" icon={<span>📦</span>} collapsed={collapsed} />
            <NavItem label="Orders" icon={<span>🧾</span>} active collapsed={collapsed} />
            <div className={`mt-1 ${collapsed ? 'ml-0' : 'ml-4'} space-y-1`}>
              <NavItem label="All Orders" icon={<span>#</span>} active collapsed={collapsed} />
              <NavItem label="Returns" icon={<span>↩️</span>} collapsed={collapsed} />
              <NavItem label="Order Tracking" icon={<span>📍</span>} collapsed={collapsed} />
            </div>
            <NavItem label="Sales" icon={<span>💰</span>} collapsed={collapsed} />
            <NavItem label="Customers" icon={<span>👥</span>} collapsed={collapsed} />
            <NavItem label="Reports" icon={<span>📊</span>} collapsed={collapsed} />
          </nav>

          {!collapsed && (
            <>
              <div className="mt-6 border-t pt-4 space-y-2">
                <div className="text-sm text-zinc-500">Settings</div>
                <NavItem label="Marketplace Sync" icon={<span>🔁</span>} collapsed={collapsed} />
                <NavItem label="Payment Gateways" icon={<span>💳</span>} collapsed={collapsed} />
                <NavItem label="Settings" icon={<span>⚙️</span>} collapsed={collapsed} />
                <NavItem label="Help Center" icon={<span>❓</span>} collapsed={collapsed} />
              </div>

              <div className="mt-6 p-3 rounded-lg bg-zinc-50">
                <div className="text-sm font-semibold">Upgrade to Premium</div>
                <div className="text-xs text-zinc-500 mt-1">Trial ends in 12 days</div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r p-4">
            <div className="mb-4">
              <div className="text-sm text-zinc-500">Workspace</div>
              <div className="mt-2 p-2 rounded-md border">Uxerflow ▾</div>
            </div>
            <nav className="space-y-1">
              <NavItem label="Dashboard" collapsed={false} />
              <NavItem label="Products" collapsed={false} />
              <NavItem label="Orders" active collapsed={false} />
              <div className="ml-4 mt-1 space-y-1">
                <NavItem label="All Orders" active collapsed={false} />
                <NavItem label="Returns" collapsed={false} />
                <NavItem label="Order Tracking" collapsed={false} />
              </div>
              <NavItem label="Sales" collapsed={false} />
              <NavItem label="Customers" collapsed={false} />
              <NavItem label="Reports" collapsed={false} />
            </nav>

            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="text-sm text-zinc-500">Settings</div>
              <NavItem label="Marketplace Sync" collapsed={false} />
              <NavItem label="Payment Gateways" collapsed={false} />
              <NavItem label="Settings" collapsed={false} />
              <NavItem label="Help Center" collapsed={false} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
