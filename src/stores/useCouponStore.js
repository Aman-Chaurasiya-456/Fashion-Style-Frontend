import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useCouponStore = create((set) => ({
  coupons: [],
  loading: false,

  setCoupons: (coupons) => set({ coupons }),

  // Create a new coupon
  createCoupon: async (couponData) => {
    console.log(couponData);
    set({ loading: true });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/coupons/add`,
        couponData
      );
      set((prevState) => ({
        coupons: [...prevState.coupons, res.data.coupon],
        loading: false,
      }));
      toast.success("Coupon added successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Failed to add coupon");
      set({ loading: false });
    }
  },

  // Fetch all coupons
  fetchAllCoupons: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/coupons`
      );
      set({ coupons: response.data.coupons, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch coupons", loading: false });
      toast.error(error.response.data.message || "Failed to fetch coupons");
    }
  },

  // Delete a coupon by ID
  deleteCoupon: async (couponId) => {
    set({ loading: true });
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/coupons/delete/${couponId}`
      );
      set((prevState) => ({
        coupons: prevState.coupons.filter((coupon) => coupon._id !== couponId),
        loading: false,
      }));
      toast.success("Coupon deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "Failed to delete coupon");
    }
  },

  // Toggle the active status of a coupon
  toggleCouponStatus: async (couponId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/coupons/toggle/${couponId}`
      );
      set((prevState) => ({
        coupons: prevState.coupons.map((coupon) =>
          coupon._id === couponId
            ? { ...coupon, isActive: response.data.isActive }
            : coupon
        ),
        loading: false,
      }));
      toast.success("Coupon status updated");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "Failed to update coupon");
    }
  },
}));
