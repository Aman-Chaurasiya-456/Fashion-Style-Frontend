import { create } from "zustand";
import axios from "../lib/axios";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/confirmed-orders`
      );
      set({ orders: response.data.orders, loading: false });
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ error: "Failed to fetch orders", loading: false });
    }
  },
}));
