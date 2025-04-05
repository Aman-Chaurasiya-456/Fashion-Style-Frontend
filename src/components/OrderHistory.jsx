import React, { useEffect } from "react";
import { useOrderStore } from "../stores/useOrderStore";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const { orders, loading, error, fetchOrders } = useOrderStore();

  useEffect(() => {
    console.log(orders);
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center space-y-2">
          <p>No orders yet.</p>
          <Link
            to="/shop"
            className="inline-block bg-emerald-600 text-white py-2 px-4 rounded"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="border rounded p-4">
              <p className="text-lg font-semibold">Order ID: {order._id}</p>
              <p>Total: ${order.total}</p>
              <button className="mt-2 bg-emerald-600 text-white py-1 px-2 rounded">
                Generate Invoice
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
