"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome</h2>
        {!isConnected ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Connect your wallet to get started</p>
            <ConnectButton />
          </div>
        ) : (
          <div>
            <p className="text-gray-600">Wallet connected! Start building your features here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

