"use client";

const PaymentSuccess = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-100">
      <div className="p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-semibold text-green-600">
          Payment Successful!
        </h1>
        <p className="mt-4 text-gray-700">Thank you for your purchase.</p>
        <a
          href="/payment"
          className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Go Back
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
