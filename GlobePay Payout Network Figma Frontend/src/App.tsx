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

export default function App() {
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
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
      <Toaster />
    </div>
  );
}
