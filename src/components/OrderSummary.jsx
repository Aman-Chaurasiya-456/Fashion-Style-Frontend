import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import { jsPDF } from "jspdf";

const stripePromise = loadStripe(
  "pk_test_51KZYccCoOZF2UhtOwdXQl3vcizup20zqKqT9hVUIsVzsdBrhqbUI2fE0ZdEVLdZfeHjeyFXtqaNsyCJCmZWnjNZa00PzMAjlcL"
);

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const res = await axios.post("/payments/create-checkout-session", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
    });

    const session = res.data;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error("Error:", result.error);
    }
  };

  const generateInvoice = (products, totalAmount, coupon) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");

    // Invoice Header
    doc.setFontSize(18);
    doc.text("INVOICE", 20, 20);

    // User Information
    doc.setFontSize(12);
    doc.text("Name: Aftab", 20, 40);
    doc.text("Email: user@example.com", 20, 50);
    doc.text("Phone: 9999999999", 20, 60);

    // Product Details
    doc.text("Product Details:", 20, 80);
    let y = 90;
    products.forEach((product) => {
      doc.text(
        `${product.name} (Qty: ${product.quantity}) - $${product.price.toFixed(
          2
        )}`,
        20,
        y
      );
      y += 10;
    });

    // Summary
    doc.text("Subtotal: $" + formattedSubtotal, 20, y);
    y += 10;
    doc.text("Savings: -$" + formattedSavings, 20, y);
    y += 10;
    if (coupon && isCouponApplied) {
      doc.text(
        `Coupon Applied: -${coupon.code} (${coupon.discountPercentage}%)`,
        20,
        y
      );
      y += 10;
    }
    doc.text("Total: $" + formattedTotal, 20, y);
    y += 10;

    // Taxes (GST, CGST, SGST)
    const gst = totalAmount * 0.18; // 18% GST
    const cgst = gst / 2; // CGST and SGST are equal
    const sgst = gst / 2;

    doc.text("GST (18%): $" + gst.toFixed(2), 20, y);
    y += 10;
    doc.text("CGST: $" + cgst.toFixed(2), 20, y);
    y += 10;
    doc.text("SGST: $" + sgst.toFixed(2), 20, y);
    y += 10;

    // Final Total with Tax
    doc.text("Final Total: $" + (totalAmount + gst).toFixed(2), 20, y);
    y += 10;

    // Footer - Stamp and Signature
    doc.text("Authorized Signatory: ___________________", 20, y);
    doc.text("Company Stamp", 20, y + 10);

    // Save the PDF file
    doc.save("invoice.pdf");
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ${formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ${formattedTotal}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 mt-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => generateInvoice(cart, total, coupon)} // Trigger invoice download
        >
          Download Invoice
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
export default OrderSummary;
