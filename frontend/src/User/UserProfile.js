import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Shield,
  Mail,
  Key,
  Wallet,
  User,
  Calendar,
  Users,
  AlertCircle,
  Check,
  X,
  Edit3,
} from "lucide-react";
import {
  signupUser,
  clearErrors,
  clearMessage,
  sendVerificationEmail,
  verifyEmailCode,
  sendUserVerificationEmail,
} from "../redux/authSlice";
import { updateUsers } from "../redux/userSlice";

// Mock components - replace with your actual components
const Loader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const SuccessAlert = ({ message }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
    <Check className="w-5 h-5 mr-2" />
    {message}
  </div>
);

const ErrorAlert = ({ error }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
    <X className="w-5 h-5 mr-2" />
    {error}
  </div>
);

export default function UserProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Replace with your actual selector
  const { singleuser } = useSelector((state) => state.allusers);
  const { loading, error, message } = useSelector((state) => state.auth);

  const [editUser, setEditUser] = useState({});
  const [verificationStep, setVerificationStep] = useState("initial"); // 'initial', 'otp', 'updating'
  const [otpCode, setOtpCode] = useState("");
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [emailToVerify, setEmailToVerify] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Initialize editUser with current user data
    if (singleuser) {
      setEditUser({
        email: singleuser.email || "",
        phone: singleuser.phone || "",
        bep20: singleuser.bep20 || "",
      });
    }

    // Handle errors and messages
    if (error) {
      const errorInterval = setInterval(() => {
        // dispatch(clearErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }
    if (message) {
      const messageInterval = setInterval(() => {
        // dispatch(clearMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, error, message, id, singleuser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Single update function with email verification
  const handleSaveChanges = async () => {
    // Check if anything was actually changed
    const hasChanges =
      editUser.email !== singleuser?.email ||
      editUser.phone !== singleuser?.phone ||
      editUser.bep20 !== singleuser?.bep20;

    if (!hasChanges) {
      alert("No changes detected");
      return;
    }

    // Store all pending changes
    const updatedData = {
      ...editUser,
      updated_at: new Date().toISOString(),
    };
    setPendingUpdates(updatedData);

    // Send verification code to user's current email
    await sendVerificationCode();
    setVerificationStep("otp");
  };

  const sendVerificationCode = async () => {
    try {
      console.log("Sending verification code to:", singleuser?.email);
      await dispatch(sendUserVerificationEmail({ email: singleuser?.email }));
      setEmailToVerify(singleuser.email);
      setIsEmailSent(true);
      setVerificationError("");
    } catch (error) {
      setVerificationError("Failed to send verification email");
    }
  };

  const handleOtpVerification = async () => {
    try {
      console.log("Verifying OTP:", otpCode);

      const result = await dispatch(
        verifyEmailCode({
          email: singleuser?.email,
          otp: otpCode,
        })
      );

      // Check if verification was successful
      if (result.type.includes("fulfilled")) {
        // OTP verified successfully, proceed with update
        setVerificationStep("updating");
        await performUpdate();
      } else {
        setVerificationError("Invalid verification code");
      }
    } catch (error) {
      setVerificationError("Verification failed");
    }
  };

  const performUpdate = async () => {
    try {
      console.log("Updating user with:", pendingUpdates);

      await dispatch(
        updateUsers({
          id: id,
          updatedData: pendingUpdates,
        })
      );

      // Reset everything after successful update
      resetVerification();
      setIsEditing(false);

      // Optional: Show success message
      console.log("User updated successfully");
    } catch (error) {
      setVerificationError("Update failed");
      setVerificationStep("otp");
    }
  };

  const resetVerification = () => {
    setVerificationStep("initial");
    setOtpCode("");
    setPendingUpdates({});
    setVerificationError("");
    setIsEmailSent(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form to current user data when entering edit mode
      setEditUser({
        email: singleuser?.email || "",
        phone: singleuser?.phone || "",
        bep20: singleuser?.bep20 || "",
      });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditUser({
      email: singleuser?.email || "",
      phone: singleuser?.phone || "",
      bep20: singleuser?.bep20 || "",
    });
  };

  const renderVerificationModal = () => {
    if (verificationStep === "initial") return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {verificationStep === "otp" && (
                <Key className="w-8 h-8 text-blue-600" />
              )}
              {verificationStep === "updating" && (
                <Check className="w-8 h-8 text-green-600" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {verificationStep === "otp" && "Verify Your Email"}
              {verificationStep === "updating" && "Updating Profile..."}
            </h3>
            <p className="text-gray-600">
              {verificationStep === "otp" &&
                `Enter the 6-digit code sent to ${singleuser?.email}`}
              {verificationStep === "updating" &&
                "Please wait while we update your profile"}
            </p>
          </div>

          {verificationStep === "otp" && (
            <div className="space-y-4">
              {verificationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{verificationError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <div className="text-sm text-gray-600 text-center">
                Code sent to:{" "}
                <span className="font-medium">{singleuser?.email}</span>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Changes to be made:
                </h4>
                <div className="space-y-1 text-sm text-blue-800">
                  {pendingUpdates.email !== singleuser?.email && (
                    <div>
                      • Email: {singleuser?.email} → {pendingUpdates.email}
                    </div>
                  )}
                  {pendingUpdates.phone !== singleuser?.phone && (
                    <div>
                      • Phone: {singleuser?.phone || "None"} →{" "}
                      {pendingUpdates.phone}
                    </div>
                  )}
                  {pendingUpdates.bep20 !== singleuser?.bep20 && (
                    <div>
                      • BEP-20:{" "}
                      {singleuser?.bep20
                        ? "****" + singleuser?.bep20.slice(-6)
                        : "None"}{" "}
                      → {"****" + pendingUpdates.bep20.slice(-6)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={resetVerification}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOtpVerification}
                  disabled={otpCode.length !== 6}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Verify & Update
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={sendVerificationCode}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {verificationStep === "updating" && (
            <div className="text-center py-8"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`${
          loading ? "h-96 flex items-center justify-center" : "min-h-screen"
        } bg-white`}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            {message && <SuccessAlert message={message} />}
            {error && <ErrorAlert error={error} />}

            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-md shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-6">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold text-white">
                          {singleuser?.username}
                        </h1>
                        <p className="text-blue-100 text-sm">User Profile & Settings</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleEditMode}
                      className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{isEditing ? "View Mode" : "Edit Mode"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-5">
                  {/* Left Column - Update Form */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-blue-600" />
                        {isEditing ? "Update Details" : "Profile Details"}
                      </h3>

                      <div className="space-y-6">
                        {isEditing && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <Mail className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="text-blue-800 text-sm font-medium">
                                All changes require email verification for
                                security
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Email Field */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email Address
                          </label>
                          <input
                            name="email"
                            type="email"
                            value={editUser.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-100"
                            }`}
                            placeholder="Enter Email"
                          />
                        </div>

                        {/* Phone Field */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Phone Number
                          </label>
                          <input
                            name="phone"
                            type="tel"
                            value={editUser.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-100"
                            }`}
                            placeholder="Enter Phone Number"
                          />
                        </div>

                        {/* BEP-20 Address Field */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <Wallet className="w-4 h-4 mr-2" />
                            BEP-20 Wallet Address
                          </label>
                          <input
                            name="bep20"
                            value={editUser.bep20}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-100"
                            }`}
                            placeholder="0x..."
                          />
                        </div>

                        {/* Action Buttons */}
                        {isEditing ? (
                          <div className="flex space-x-3">
                            <button
                              onClick={cancelEdit}
                              className="flex-1 border border-gray-300 text-gray-700 text-lg font-semibold py-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveChanges}
                              disabled={loading}
                              className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold py-4 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${
                                loading
                                  ? "opacity-60 cursor-not-allowed"
                                  : "hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                              }`}
                            >
                              {loading ? (
                                // Replace with your spinner component or an inline SVG
                                <svg
                                  className="animate-spin h-5 w-5 text-white"
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
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                  ></path>
                                </svg>
                              ) : (
                                <>
                                  <Shield className="w-5 h-5" />
                                  <span>Verify & Update</span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-600">
                              Click "Edit Mode" to update your profile
                              information
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - User Details */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <User className="w-6 h-6 mr-3 text-blue-600" />
                        Account Information
                      </h3>

                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="grid grid-cols-1 gap-4">
                          {[
                            {
                              label: "Last Login",
                              value: singleuser?.last_login,
                              icon: (
                                <Calendar className="w-4 h-4 text-gray-400" />
                              ),
                            },
                            {
                              label: "Account Created",
                              value: singleuser?.created_at,
                              icon: (
                                <Calendar className="w-4 h-4 text-gray-400" />
                              ),
                            },
                            {
                              label: "Referred By",
                              value: singleuser?.reffer_by,
                              icon: <Users className="w-4 h-4 text-gray-400" />,
                            },
                            {
                              label: "Activation Date",
                              value: singleuser?.activation_date,
                              icon: (
                                <Calendar className="w-4 h-4 text-gray-400" />
                              ),
                            },
                            {
                              label: "Last Updated",
                              value: singleuser?.updated_at,
                              icon: (
                                <Calendar className="w-4 h-4 text-gray-400" />
                              ),
                            },
                            {
                              label: "Referral Code",
                              value:
                                singleuser?.active_plan == 0
                                  ? "Referral code not active"
                                  : singleuser?.refferal_code,
                              icon: <Key className="w-4 h-4 text-gray-400" />,
                            },
                            {
                              label: "Total Team",
                              value: singleuser?.total_team,
                              icon: <Users className="w-4 h-4 text-gray-400" />,
                            },
                          ].map(({ label, value, icon }, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center">
                                {icon}
                                <span className="font-medium text-gray-700 ml-2">
                                  {label}
                                </span>
                              </div>
                              <span className="text-gray-900 font-medium">
                                {value || "-"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Additional Info Cards */}
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <div className="text-base font-semibold text-blue-600">
                            {singleuser?.total_team || 0}
                          </div>
                          <div className="text-sm text-blue-800 font-medium">
                            Team Members
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                          <div className="text-base font-semibold text-green-600">
                            {singleuser?.active_plan ? "Active" : "Inactive"}
                          </div>
                          <div className="text-sm text-green-800 font-medium">
                            Plan Status
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {renderVerificationModal()}
    </>
  );
}
