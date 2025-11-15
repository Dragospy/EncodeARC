import { createClient } from "@/utils/supabase/client";

export interface UserDetails {
  wallet_id: string;
  account_type: "person" | "business" | null;
  name: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow for additional fields that might exist in the database
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
};
