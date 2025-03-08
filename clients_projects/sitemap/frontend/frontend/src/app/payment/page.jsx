"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      Swal.fire("Error", "Stripe is not loaded", "error");
      return;
    }

    setLoading(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: fullName,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const response = await axios.post("/api/payment_method", {
        paymentMethodId: paymentMethod.id,
        fullName: fullName,
      });

      if (!response.data.success) {
        throw new Error(response.data.error);
      }

      const paymentIntent = response.data.paymentIntent;

      if (paymentIntent.status === "requires_action") {
        const { error: confirmError } = await stripe.confirmCardPayment(
          paymentIntent.client_secret,
          {
            return_url: `${window.location.origin}/payment-success`,
          }
        );

        if (confirmError) {
          throw new Error(confirmError.message);
        }
      }

      setLoading(false);
      Swal.fire("Success", "Payment Successful!", "success");
      window.location.href = "/payment-success";
    } catch (error) {
      setLoading(false);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <form
      onSubmit={handlePayment}
      className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg"
    >
      <h2 className="mb-6 text-center text-black text-xl font-semibold">
        Payment Form
      </h2>

      <div className="mb-4">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-900"
        >
          Full Name*
        </label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="block text-black w-full p-2 border rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900">
          Card Number*
        </label>
        <CardNumberElement className="p-3 border rounded-lg text-black" />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900">
            Expiry Month*
          </label>
          <CardExpiryElement className="p-3 border rounded-lg text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            CVV*
          </label>
          <CardCvcElement className="p-3 border rounded-lg text-black" />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default PaymentPage;
