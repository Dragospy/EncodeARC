import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PersonNavigationView } from "../page";
import {
  LayoutDashboard,
  Wallet,
  Send,
  ArrowLeftRight,
  Users,
  ShieldCheck,
  Settings,
  Globe,
} from "lucide-react";

interface SidebarProps {
  currentView: PersonNavigationView;
  onNavigate: (view: PersonNavigationView) => void;
}

const navigationItems = [
  { id: "dashboard" as PersonNavigationView, label: "Dashboard", icon: LayoutDashboard },
  { id: "wallets" as PersonNavigationView, label: "Wallets", icon: Wallet },
  { id: "send-payout" as PersonNavigationView, label: "Send Payout", icon: Send },
  { id: "transactions" as PersonNavigationView, label: "Transactions", icon: ArrowLeftRight },
  { id: "recipients" as PersonNavigationView, label: "Recipients", icon: Users },
  //{ id: "settings" as PersonNavigationView, label: "Settings", icon: Settings },
];

export function SidebarUser({ currentView, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="tracking-tight">GlobePay</div>
            <div className="text-xs text-slate-400">Global Payouts</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="flex justify-end mt-4">
        <div className="scale-[0.80] origin-center">
          {" "}
          {/* 90% size */}
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
