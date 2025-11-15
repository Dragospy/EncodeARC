"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { User, Building2 } from "lucide-react";
import { Wallets } from "./components/Wallets";
import { SendPayout } from "./components/SendPayout";
import { Transactions } from "./components/Transactions";
import { Recipients } from "./components/Recipients";
import { Compliance } from "./components/Compliance";
import { SidebarBusiness } from "./components/SidebarBusiness";
import { DashboardBusiness } from "./components/DashboardBusiness";
import { Employees } from "./components/Employees";
import { SettingsBusiness } from "./components/SettingsBusiness";
import { SidebarUser } from "./components/SidebarUser";
import { DashboardPerson } from "./components/DashboardPerson";
import { SettingsUser } from "./components/SettingsUser";
import { Toaster } from "./components/ui/sonner";
import { createClient } from "@/utils/supabase/client";
import { userHandler } from "@/utils/userHandler";

export type NavigationView =
  | "dashboard"
  | "wallets"
  | "send-payout"
  | "transactions"
  | "recipients"
  | "compliance"
  | "settings";

export type BusinessNavigationView =
  | "dashboard"
  | "wallets"
  | "payroll"
  | "transactions"
  | "employees"
  | "compliance"
  | "settings";

export type PersonNavigationView =
  | "dashboard"
  | "wallets"
  | "send-payout"
  | "transactions"
  | "recipients"
  | "compliance"
  | "settings";

export default function Home() {
  const { isConnected, address } = useAccount();
  const [currentView, setCurrentView] = useState<NavigationView>("dashboard");
  const [currentBusinessView, setCurrentBusinessView] =
    useState<BusinessNavigationView>("dashboard");
  const [currentPersonView, setCurrentPersonView] = useState<PersonNavigationView>("dashboard");
  const [isAccountRegistered, setIsAccountRegistered] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accountType, setAccountType] = useState<"person" | "business" | null>(null);
  const [accountName, setAccountName] = useState<string>("");
  const [isWalletStatusChecked, setIsWalletStatusChecked] = useState(false);

  const renderBusinessView = () => {
    switch (currentBusinessView) {
      case "dashboard":
        return <DashboardBusiness onNavigate={setCurrentBusinessView} />;
      case "wallets":
        return <Wallets />;
      case "payroll":
        return <SendPayout />;
      case "transactions":
        return <Transactions />;
      case "employees":
        return <Employees />;
      case "compliance":
        return <Compliance />;
      case "settings":
        return <SettingsBusiness />;
      default:
        return <DashboardBusiness onNavigate={setCurrentBusinessView} />;
    }
  };

  const renderPersonView = () => {
    switch (currentPersonView) {
      case "dashboard":
        return <DashboardPerson onNavigate={setCurrentPersonView} />;
      case "wallets":
        return <Wallets />;
      case "send-payout":
        return <SendPayout />;
      case "transactions":
        return <Transactions />;
      case "recipients":
        return <Recipients />;
      case "compliance":
        return <Compliance />;
      case "settings":
        return <SettingsUser />;
      default:
        return <DashboardPerson onNavigate={setCurrentPersonView} />;
    }
  };

  const getAccountType = async (walletId: string): Promise<"person" | "business" | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("accounts")
      .select("account_type")
      .eq("wallet_id", walletId)
      .maybeSingle();

    if (error) {
      console.error("Error getting account type:", error);
      return null;
    }

    return data?.account_type as "person" | "business" | null;
  };

  const getUserAccountRegistered = async (walletId: string): Promise<boolean> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("accounts")
      .select("wallet_id")
      .eq("wallet_id", walletId)
      .maybeSingle();

    if (error) {
      console.error("Error checking account:", error);
      return false;
    }

    return !!data;
  };

  // Check wallet connection status on mount
  useEffect(() => {
    // Small delay to allow wagmi to initialize and check connection status
    const timer = setTimeout(() => {
      setIsWalletStatusChecked(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (address) {
      setIsLoading(true);
      Promise.all([getUserAccountRegistered(address), getAccountType(address)])
        .then(([registered, type]) => {
          setIsAccountRegistered(registered);
          setAccountType(type);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error checking account registration:", error);
          setIsAccountRegistered(false);
          setAccountType(null);
          setIsLoading(false);
        });
      getAccountType(address)
        .then((accountType) => {
          setAccountType(accountType);
        })
        .catch((error) => {
          console.error("Error getting account type:", error);
          setAccountType(null);
          setIsLoading(false);
        });
      getAccountType(address)
        .then((accountType) => {
          setAccountType(accountType);
        })
        .catch((error) => {
          console.error("Error getting account type:", error);
          setAccountType(null);
          setIsLoading(false);
        });
    } else if (isWalletStatusChecked) {
      // If wallet status is checked and no address, user is not connected
      setIsLoading(false);
    }
  }, [address, isWalletStatusChecked]);

  const handleContinue = async (selectedType: "person" | "business", name: string) => {
    if (!address) {
      console.error("No wallet address available");
      return;
    }

    if (!name.trim()) {
      console.error("Account name is required");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("accounts").insert({
        wallet_id: address,
        account_type: selectedType,
        name: name.trim(),
      });

      if (error) {
        console.error("Error creating account:", error);
        return;
      }

      console.log("Account created successfully");

      // Refresh the page to reload the account status
      window.location.reload();
    } catch (error) {
      console.error("Error in handleContinue:", error);
    }
  };

  const defaultRender = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">Loading...</p>
        </div>
      );
    }

    // If user is not registered, show them account type selection
    if (!isAccountRegistered) {
      return (
        <div className="flex items-center justify-center h-full p-8 bg-gradient-to-br from-slate-50 to-white">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-12 flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-3">Choose Your Account Type</h1>
              <p className="text-lg text-slate-600">
                Select the type of account that best fits your needs
              </p>
              <ConnectButton />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Person Card */}
              <button
                onClick={() => setAccountType("person")}
                className={`
                  relative group p-8 rounded-2xl border-2 transition-all duration-300
                  bg-white hover:shadow-xl hover:scale-[1.02]
                  ${
                    accountType === "person"
                      ? "border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-lg shadow-blue-600/20"
                      : "border-slate-200 hover:border-blue-400"
                  }
                `}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`
                      w-20 h-20 rounded-2xl flex items-center justify-center transition-all
                      ${
                        accountType === "person"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                          : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }
                    `}
                  >
                    <User className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">Person</h3>
                    <p className="text-slate-600 text-sm max-w-xs">
                      Perfect for individuals who want to send and receive payments
                    </p>
                  </div>
                  {accountType === "person" && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              {/* Business Card */}
              <button
                onClick={() => setAccountType("business")}
                className={`
                  relative group p-8 rounded-2xl border-2 transition-all duration-300
                  bg-white hover:shadow-xl hover:scale-[1.02]
                  ${
                    accountType === "business"
                      ? "border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-lg shadow-blue-600/20"
                      : "border-slate-200 hover:border-blue-400"
                  }
                `}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`
                      w-20 h-20 rounded-2xl flex items-center justify-center transition-all
                      ${
                        accountType === "business"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                          : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }
                    `}
                  >
                    <Building2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">Business</h3>
                    <p className="text-slate-600 text-sm max-w-xs">
                      Ideal for companies managing payroll and bulk payments
                    </p>
                  </div>
                  {accountType === "business" && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Account Name Input */}
            {accountType && (
              <div className="mt-8 max-w-md mx-auto">
                <label
                  htmlFor="accountName"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Account Name
                </label>
                <input
                  id="accountName"
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder={`Enter your ${accountType === "person" ? "name" : "business name"}`}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
              </div>
            )}

            {/* Continue Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => accountType && handleContinue(accountType, accountName)}
                disabled={!accountType || !accountName.trim()}
                className={`
                  px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200
                  ${
                    accountType && accountName.trim()
                      ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-105 cursor-pointer"
                      : "bg-slate-300 cursor-not-allowed"
                  }
                `}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If user is registered, show them the dashboard
    if (accountType === "business") {
      return (
        <div className="flex h-screen w-screen">
          <SidebarBusiness currentView={currentBusinessView} onNavigate={setCurrentBusinessView} />
          <main className="w-full h-full overflow-auto">{renderBusinessView()}</main>
          <Toaster />
        </div>
      );
    } else {
      // Person account type
      return (
        <div className="flex h-screen w-screen">
          <SidebarUser currentView={currentPersonView} onNavigate={setCurrentPersonView} />
          <main className="w-full h-full overflow-auto">{renderPersonView()}</main>
          <Toaster />
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow h-screen w-screen">
        {!isWalletStatusChecked ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : address ? (
          defaultRender()
        ) : !isConnected ? (
          <div className="text-center py-8 h-full flex-col items-center justify-center">
            <p className="text-gray-600 mb-4">Connect your wallet to get started</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
