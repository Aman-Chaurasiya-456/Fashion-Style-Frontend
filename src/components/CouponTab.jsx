import { useState } from "react";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useCouponStore } from "../stores/useCouponStore";

const CouponTab = () => {
  const { deleteCoupon, createCoupon, coupons } = useCouponStore();

  console.log(coupons);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [expirationDate, setExpirationDate] = useState("");

  const handleCreateCoupon = () => {
    if (!name || !code || discount <= 0 || !expirationDate) return;
    createCoupon({ name, code, discount, expirationDate });
    // setName("");
    // setCode("");
    // setDiscount(0);
    // setExpirationDate("");
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create Coupon
      </h2>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Coupon Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Coupon Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Discount (%)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Expiration Date
          </label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
          />
        </div>

        <button
          type="button"
          onClick={handleCreateCoupon}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Create Coupon
        </button>
      </form>

      <table className="min-w-full mt-5 divide-y divide-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Discount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Expires
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Active
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-700">
          {coupons?.map((coupon) => (
            <tr key={coupon._id} className="hover:bg-gray-700">
              <td className="px-6 py-4">{coupon.name}</td>
              <td className="px-6 py-4">{coupon.code}</td>
              <td className="px-6 py-4">{coupon.discountPercentage}%</td>
              <td className="px-6 py-4">
                {new Date(coupon.expirationDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-white ${
                    coupon.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => deleteCoupon(coupon._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default CouponTab;
