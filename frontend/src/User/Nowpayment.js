import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  createPayment,
  getCurrencies,
  getMinAmount,
  getPaymentStatus,
} from "../services/api";
import GateWayQr from "./GateWayQr";
import { useParams } from "react-router-dom";

const Nowpayments = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    price_amount: "",
    price_currency: "usd",
    pay_currency: "",
    id,
  });
  const [currencies, setCurrencies] = useState([]);
  const [minAmount, setMinAmount] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCurrencies();
        setCurrencies(data.currencies);
      } catch (err) {
        console.error("Error fetching currencies:", err);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (formData.price_currency && formData.pay_currency) {
      const fetchMinAmount = async () => {
        try {
          const data = await getMinAmount(
            formData.price_currency,
            formData.pay_currency
          );
          setMinAmount(data.min_amount);
        } catch (err) {
          console.error("Error fetching min amount:", err);
        }
      };
      fetchMinAmount();
    }
  }, [formData.price_currency, formData.pay_currency]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await createPayment({
        ...formData,
        price_amount: parseFloat(formData.price_amount),
      });

      setPaymentResult(result);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create payment");
      console.error("Payment creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto ">
      <div className="overflow-hidden border border-gray-300 shadow-sm rounded-md">
        {/* Header */}
        <div className="p-4 bg-gray-100 text-left border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-900">
            {!paymentResult ? "Crypto Payment Gateway" : "Payment Details"}
          </h2>
          <p className="text-gray-900 text-sm ">
            {!paymentResult
              ? "Pay with cryptocurrency quickly and securely"
              : "Track your payment status below"}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white p-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium">Payment Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {!paymentResult ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount to Pay
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {formData.price_currency === "usd"
                          ? "$"
                          : formData.price_currency === "eur"
                          ? "€"
                          : formData.price_currency === "gbp"
                          ? "£"
                          : ""}
                      </span>
                    </div>
                    <input
                      type="number"
                      name="price_amount"
                      value={formData.price_amount}
                      onChange={handleChange}
                      step="0.01"
                      required
                      className="block w-full text-gray-800 border pl-10 pr-12 py-3 border-gray-300 rounded-md  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <select
                    name="price_currency"
                    value={formData.price_currency}
                    onChange={handleChange}
                    required
                    className="mt-1 border text-gray-800 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="usd">USDT</option>
                    {/* <option value="eur">EUR</option>
                    <option value="gbp">GBP</option> */}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pay With Cryptocurrency
                </label>
                <select
  name="pay_currency"
  value={formData.pay_currency}
  onChange={handleChange}
  required
  className="appearance-none border text-gray-800 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
>
  <option value="">Select a cryptocurrency</option>
  {currencies
    .filter((currency) => currency.toLowerCase() === "usdtbsc")
    .map((currency) => (
      <option key={currency} value={currency}>
        USDTBEP 20
      </option>
    ))}
</select>

              </div>

              {minAmount && (
                <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Minimum Payment Amount
                    </p>
                    <p className="text-sm text-blue-700">
                      The minimum payment for{" "}
                      {formData.pay_currency.toUpperCase()} is{" "}
                      <span className="font-bold">{minAmount}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={` flex justify-center items-center py-2 px-4 rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                    isLoading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Create Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 grid-cols-1  gap-4">
                <div className=" rounded-md border-gray-200 border  shadow-sm">
                  <div className="flex items-center  bg-gradient-to-r from-green-50 to-green-100  mb-1 p-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Payment Created Successfully
                      </h3>
                      <p className="text-sm text-gray-600">
                        Complete your payment before{" "}
                        {new Date(paymentResult.expires_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 p-4 gap-4 mb-2">
                    <div className="bg-white/70 border border-gray-200 p-4 rounded-md backdrop-blur-sm">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment ID
                      </p>
                      <p className="font-mono font-medium text-gray-900 break-all">
                        {paymentResult.payment_id}
                      </p>
                    </div>
                    <div className="bg-white/70 border border-gray-200 p-4 rounded-md backdrop-blur-sm">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </p>
                      <p className="font-medium text-gray-900">
                        {paymentResult.price_amount}{" "}
                        {paymentResult.price_currency.toUpperCase()}
                      </p>
                    </div>
                    <div className="bg-white/70 border border-gray-200 p-4 rounded-md backdrop-blur-sm ">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pay Address
                      </p>
                      <p className="font-mono font-medium text-gray-900 break-all">
                        {paymentResult.pay_address}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 px-4">
                    <Link
                      to={paymentResult.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex text-sm  justify-center items-center px-4 py-2.5 border border-transparent  font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      Pay Now via NOWPayments
                    </Link>
                    <button
                      onClick={() => setPaymentResult(null)}
                      className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create New Payment
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-md shadow-inner pb-5">
                  <h3 className="text-lg font-medium px-4 py-[26px] bg-gray-200 text-gray-900  text-center">
                    Scan to Pay with {paymentResult.pay_currency.toUpperCase()}
                  </h3>
                  <div className="flex justify-center">
                    <GateWayQr address={paymentResult?.pay_address} />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Send exactly {paymentResult.pay_amount}{" "}
                      {paymentResult.pay_currency.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Network fees may apply
                    </p>
                  </div>
                </div>
              </div>
              <PaymentStatusTracker paymentId={paymentResult.payment_id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Enhanced PaymentStatus component with automatic updates
const PaymentStatusTracker = ({ paymentId }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showFailedPage, setShowFailedPage] = useState(false);

  // Status polling interval in milliseconds (10 seconds)
  const POLLING_INTERVAL = 10000;

  // Define which statuses are considered final
  const FINAL_STATUSES = ["finished", "failed", "refunded", "expired"];
  const SUCCESS_STATUSES = ["finished"];
  const FAILED_STATUSES = ["failed", "refunded", "expired"];

  useEffect(() => {
    let intervalId;

    const fetchPaymentStatus = async () => {
      if (!paymentId) return;

      setIsLoading(true);
      setError("");

      try {
        const status = await getPaymentStatus(paymentId);
        setPaymentStatus(status);

        // Check if payment reached a final status
        if (FINAL_STATUSES.includes(status.payment_status)) {
          // Clear the interval when we reach a final status
          clearInterval(intervalId);

          // Show appropriate result page
          if (SUCCESS_STATUSES.includes(status.payment_status)) {
            setShowSuccessPage(true);
          } else if (FAILED_STATUSES.includes(status.payment_status)) {
            setShowFailedPage(true);
          }
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch payment status");
        console.error("Status check error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchPaymentStatus();

    // Set up polling interval
    intervalId = setInterval(fetchPaymentStatus, POLLING_INTERVAL);

    // Clean up interval on component unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentId]);

  // Render success page if payment is finished
  if (showSuccessPage) {
    return <PaymentSuccess paymentDetails={paymentStatus} />;
  }

  // Render failed page if payment failed
  if (showFailedPage) {
    return <div>Failed</div>;
    // return <PaymentFailed paymentDetails={paymentStatus} />;
  }

  return (
    <div className="bg-white rounded-md border border-gray-300 shadow-sm">
      <div className="border-b border-gray-200 bg-gray-100 px-6 py-4">
        <h2 className="text-lg font-medium  text-gray-900">Payment Status</h2>
      </div>

      <div className="p-6">
        {isLoading && !paymentStatus && (
          <div className="flex justify-center py-6">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
            <div className="mt-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Retry
              </button>
            </div>
          </div>
        )}

        {paymentStatus && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">
                Payment Details
              </h3>
              {!FINAL_STATUSES.includes(paymentStatus.payment_status) && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 animate-spin text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Auto-refreshing every {POLLING_INTERVAL / 1000}s
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 text-gray-900">
                <div className="bg-white p-4">
                  <div className="text-sm font-medium text-gray-500">
                    Payment ID
                  </div>
                  <div className="mt-1 text-sm text-gray-900 font-mono">
                    {paymentStatus.payment_id}
                  </div>
                </div>

                <div className="bg-white p-4">
                  <div className="text-sm font-medium text-gray-500">
                    Status
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        paymentStatus.payment_status === "finished"
                          ? "bg-green-100 text-green-800"
                          : paymentStatus.payment_status === "failed" ||
                            paymentStatus.payment_status === "expired"
                          ? "bg-red-100 text-red-800"
                          : paymentStatus.payment_status === "refunded"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {paymentStatus.payment_status}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4">
                  <div className="text-sm font-medium text-gray-500">
                    Amount
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {paymentStatus.pay_amount}{" "}
                    {paymentStatus.pay_currency.toUpperCase()}
                  </div>
                </div>

                <div className="bg-white p-4">
                  <div className="text-sm font-medium text-gray-500">Price</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {paymentStatus.price_amount}{" "}
                    {paymentStatus.price_currency.toUpperCase()}
                  </div>
                </div>

                <div className="bg-white p-4">
                  <div className="text-sm font-medium text-gray-500">
                    Created At
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(paymentStatus.created_at).toLocaleString()}
                  </div>
                </div>

                {paymentStatus.actually_paid && (
                  <div className="bg-white p-4">
                    <div className="text-sm font-medium text-gray-500">
                      Amount Received
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                      {paymentStatus.actually_paid}{" "}
                      {paymentStatus.pay_currency.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    {getStatusExplanation(paymentStatus.payment_status)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get human-readable explanations of payment statuses
const getStatusExplanation = (status) => {
  const explanations = {
    waiting: "Waiting for payment to be sent to the provided address.",
    confirming: "Transaction detected but not yet confirmed on the blockchain.",
    confirmed: "Transaction confirmed on the blockchain but not yet processed.",
    sending: "Payment is being processed and sent to the merchant.",
    partially_paid:
      "You've sent less than the required amount. Please send the remaining amount.",
    finished: "Payment successfully completed and processed.",
    failed: "Payment processing has failed. Please contact support.",
    refunded: "Payment was refunded back to the customer.",
    expired: "Payment time limit has expired without receiving funds.",
  };

  return explanations[status] || "Status is being processed.";
};

// Success component with payment details
const PaymentSuccess = ({ paymentDetails }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-green-500 px-4 py-5 sm:p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">
          Payment Successful!
        </h1>
        <p className="mt-1 text-white text-opacity-90">
          Thank you for your payment of {paymentDetails.price_amount}{" "}
          {paymentDetails.price_currency.toUpperCase()}.
        </p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Payment ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">
              {paymentDetails.payment_id}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Amount Paid</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {paymentDetails.actually_paid || paymentDetails.pay_amount}{" "}
              {paymentDetails.pay_currency.toUpperCase()}
            </dd>
          </div>
          {paymentDetails.order_id && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Order ID</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {paymentDetails.order_id}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};
export default Nowpayments;
