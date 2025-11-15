import { createClient } from "@/utils/supabase/client";

export interface UserDetails {
  wallet_id: string;
  account_type: "person" | "business" | null;
  name: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow for additional fields that might exist in the database
}

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  country: string | null;
  wallet: string;
  verified?: boolean;
  created_at?: string;
  [key: string]: any;
}

export interface Transaction {
  id: string;
  created_at: string;
  wallet_sender: string;
  wallet_recipier: string;
  amount: number;
  transaction_id: string | null;
  direction: "incoming" | "outgoing";
  [key: string]: any;
}

/**
 * Client-side handler for user-related database operations
 */
export const userHandler = {
  /**
   * Retrieves all user data from the database for a given wallet address
   * @param walletId - The wallet address to fetch user details for
   * @returns Promise<UserDetails | null> - User details or null if not found/error
   */
  getUserDetails: async (walletId: string): Promise<UserDetails | null> => {
    if (!walletId) {
      console.error("Wallet ID is required");
      return null;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("wallet_id", walletId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user details:", error);
        return null;
      }

      return data as UserDetails | null;
    } catch (error) {
      console.error("Error in getUserDetails:", error);
      return null;
    }
  },

  /**
   * Retrieves all contacts for a given wallet address
   * @param walletId - The wallet address to fetch contacts for
   * @returns Promise<Contact[]> - Array of contacts or empty array if error
   */
  getContacts: async (walletId: string): Promise<Contact[]> => {
    if (!walletId) {
      console.error("Wallet ID is required");
      return [];
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("wallet_id", walletId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching contacts:", error);
        return [];
      }

      return (data as Contact[]) || [];
    } catch (error) {
      console.error("Error in getContacts:", error);
      return [];
    }
  },

  /**
   * Retrieves all transactions for a given wallet address
   * Transactions are labeled as "incoming" or "outgoing" based on whether
   * the user was the recipient or sender
   * @param walletId - The wallet address to fetch transactions for
   * @returns Promise<Transaction[]> - Array of transactions or empty array if error
   */
  getTransactions: async (walletId: string): Promise<Transaction[]> => {
    if (!walletId) {
      console.error("Wallet ID is required");
      return [];
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .or(`wallet_sender.eq.${walletId},wallet_recipier.eq.${walletId}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }

      // Label transactions as incoming or outgoing
      const transactions = (data || []).map((tx: any) => ({
        ...tx,
        direction: (tx.wallet_sender === walletId ? "outgoing" : "incoming") as
          | "incoming"
          | "outgoing",
      }));

      return transactions as Transaction[];
    } catch (error) {
      console.error("Error in getTransactions:", error);
      return [];
    }
  },
};
