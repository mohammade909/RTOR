import { useState } from "react";
import WalletConnection from "./WalletConnection";
import BEP20QR from "./BEP20QR";

export default function DepositForm({ transactions, user }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [formValues, setFormValues] = useState({
    amount: "",
    currency: "USD",
    hash: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Available currencies
  const currencies = [
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "BTC", label: "Bitcoin (BTC)" },
    { value: "ETH", label: "Ethereum (ETH)" },
    { value: "USDT", label: "Tether (USDT)" },
  ];

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formValues.amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(formValues.amount) <= 0) {
      newErrors.amount = "Amount must be positive";
    } else if (parseFloat(formValues.amount) < 10) {
      newErrors.amount = "Minimum deposit amount is 10";
    }

    if (!formValues.currency) {
      newErrors.currency = "Currency is required";
    }

    if (!fileName) {
      newErrors.image = "Proof of payment is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        image: "File size exceeds 5MB limit",
      });
      return;
    }

    // Create a preview for images only
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files (like PDFs)
      setPreviewImage(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after successful submission
      setFormValues({
        amount: "",
        currency: "USD",
        hash: "",
      });
      setFileName("");
      setPreviewImage(null);
    }, 2000);

    // In a real implementation, you would submit to your API

    try {
      const formData = new FormData();
      formData.append("amount", formValues.amount);
      formData.append("currency", formValues.currency);
      formData.append("user_id", user.id); // Replace with actual user ID
      if (formValues.hash) formData.append("hash", formValues.hash);
      if (document.getElementById("image").files[0]) {
        formData.append("image", document.getElementById("image").files[0]);
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/deposite/manual",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || "Failed to submit deposit" });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred while processing your request" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto">
        <div className="bg-white rounded-xl border overflow-hidden">
          {isSubmitted ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg
                  className="h-8 w-8 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Deposit Request Submitted
              </h2>
              <p className="text-gray-600 mb-6">
                Your deposit request has been successfully submitted and is
                pending approval.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit Another Deposit
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              {/* Left Side - Form */}
              <div className="w-full md:w-3/5 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Deposit Funds
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Amount*
                    </label>
                    <div className="relative rounded-md shadow-sm text-gray-700">
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={formValues.amount}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.amount ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter deposit amount"
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-500 text-sm">{errors.amount}</p>
                    )}
                  </div>

                  {/* Currency Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="currency"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Currency*
                    </label>
                    <select
                      name="currency"
                      id="currency"
                      value={formValues.currency}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-gray-700 border ${
                        errors.currency ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                    {errors.currency && (
                      <p className="text-red-500 text-sm">{errors.currency}</p>
                    )}
                  </div>

                  {/* Hash Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="hash"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Transaction Hash (Optional)
                    </label>
                    <input
                      type="text"
                      name="hash"
                      id="hash"
                      value={formValues.hash}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-gray-700  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter transaction hash if applicable"
                    />
                    <p className="text-xs text-gray-500">
                      For cryptocurrency deposits, please provide the
                      transaction hash
                    </p>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Proof of Payment*
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                      />
                      <label
                        htmlFor="image"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        Choose File
                      </label>
                      <span className="text-sm text-gray-500 truncate max-w-xs">
                        {fileName || "No file chosen"}
                      </span>
                    </div>
                    {errors.image && (
                      <p className="text-red-500 text-sm">{errors.image}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Accepted formats: JPEG, PNG, PDF. Max size: 5MB
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 
                      ${
                        isSubmitting
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        </span>
                      ) : (
                        "Submit Deposit"
                      )}
                    </button>
                  </div>
                </form>
                  <WalletConnection />
              </div>
            
              {/* Right Side - Info and Preview */}
              <div className="w-full md:w-2/5 bg-gray-50 p-8">
                <div className="space-y-6">
                  {/* Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Deposit Information
                    </h3>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start">
                          <svg
                            className="flex-shrink-0 h-5 w-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-2 text-gray-700">
                            Minimum deposit amount: 10
                          </span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            className="flex-shrink-0 h-5 w-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-2 text-gray-700">
                            Processing time: 1-2 business days
                          </span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            className="flex-shrink-0 h-5 w-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-2 text-gray-700">
                            Proof of payment required
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <BEP20QR />
                  {/* Image Preview */}
                  {previewImage && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Preview
                      </h3>
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <img
                          src={previewImage}
                          alt="Upload preview"
                          className="max-h-64 mx-auto rounded-md"
                        />
                      </div>
                    </div>
                  )}

                  {/* Recent Deposits */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Recent Deposits
                    </h3>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="divide-y divide-gray-200">
                        {transactions && transactions.length > 0 ? (
                          transactions
                            ?.slice(-5)
                            .reverse()
                            .map((transaction) => (
                              <div
                                key={transaction.id}
                                className="px-4 py-3 flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    ${transaction.amount} {transaction.currency}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      transaction.createdAT
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                  {transaction.image_name && (
                                    <a
                                      href={transaction.image_name}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                                    >
                                      View Proof
                                    </a>
                                  )}
                                </div>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    transaction.status === "complete"
                                      ? "bg-green-100 text-green-800"
                                      : transaction.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {transaction.status.charAt(0).toUpperCase() +
                                    transaction.status.slice(1)}
                                </span>
                              </div>
                            ))
                        ) : (
                          <div className="px-4 py-3 text-center text-gray-500">
                            No transactions found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
