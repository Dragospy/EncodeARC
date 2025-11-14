"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Wallets } from './components/Wallets';
import { SendPayout } from './components/SendPayout';
import { Transactions } from './components/Transactions';
import { Recipients } from './components/Recipients';
import { Compliance } from './components/Compliance';
import { Settings } from './components/Settings';
import { Toaster } from './components/ui/sonner';

export type NavigationView = 
  | 'dashboard' 
  | 'wallets' 
  | 'send-payout' 
  | 'transactions' 
  | 'recipients' 
  | 'compliance'
  | 'settings';


export default function Home() {
  const { isConnected } = useAccount();
  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'wallets':
        return <Wallets />;
      case 'send-payout':
        return <SendPayout />;
      case 'transactions':
        return <Transactions />;
      case 'recipients':
        return <Recipients />;
      case 'compliance':
        return <Compliance />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };


  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow h-screen w-screen">
        {!isConnected ? (
          <div className="text-center py-8 h-full flex-col items-center justify-center">
            <p className="text-gray-600 mb-4">Connect your wallet to get started</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : (
          <div className="flex h-screen w-screen">
            <Sidebar currentView={currentView} onNavigate={setCurrentView} />
            <main className="w-full h-full overflow-auto">
              {renderView()}
            </main>
            <Toaster />
          </div>
        )}
      </div>
    </div>
  );
}

