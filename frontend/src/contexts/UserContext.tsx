"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { userHandler, UserDetails, Contact, Transaction } from "@/utils/userHandler";

interface UserContextType {
  user: UserDetails | null;
  contacts: Contact[];
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  walletId: string | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
  /**
   * Optional wallet_id to fetch user data for.
   * If not provided, will use the connected wallet address from wagmi.
   */
  walletId?: string;
}

export function UserProvider({ children, walletId: providedWalletId }: UserProviderProps) {
  const { address } = useAccount();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use provided walletId or fall back to connected wallet address
  const walletId = providedWalletId || address;

  const fetchUserData = useCallback(async () => {
    if (!walletId) {
      setUser(null);
      setContacts([]);
      setTransactions([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [userData, contactsData, transactionsData] = await Promise.all([
        userHandler.getUserDetails(walletId),
        userHandler.getContacts(walletId),
        userHandler.getTransactions(walletId),
      ]);

      setUser(userData);
      setContacts(contactsData);
      setTransactions(transactionsData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch user data");
      setError(error);
      setUser(null);
      setContacts([]);
      setTransactions([]);
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletId]);

  // Fetch user data when walletId changes
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const refetch = useCallback(async () => {
    await fetchUserData();
  }, [fetchUserData]);

  const value: UserContextType = {
    user,
    contacts,
    transactions,
    isLoading,
    error,
    refetch,
    walletId,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Hook to access user context data
 * @returns UserContextType with user data, contacts, transactions, loading state, error, and refetch function
 * @throws Error if used outside of UserProvider
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
