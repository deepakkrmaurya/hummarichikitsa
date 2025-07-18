import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthLogin, AuthOtpVerify } from "../Redux/authSlice";

const MobileOTPLogin = () => {
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Start countdown timer
  const startCountdown = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
  };

  // Formik & Yup Validation
  const formik = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
      otp: otpSent
        ? Yup.string()
          .matches(/^[0-9]{4}$/, "OTP must be 4 digits")
          .required("OTP is required")
        : Yup.string().notRequired(),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      setLoginError("");

      try {
        if (!otpSent) {
          // Send OTP request
          const response = await dispatch(AuthLogin({ userid: values.mobile }));
          if (response?.payload?.success) {
            setOtpSent(true);
            startCountdown();
          } else {
            setLoginError(response?.payload?.message || "Failed to send OTP");
          }
        } else {
          // Verify OTP request
          const response = await dispatch(AuthOtpVerify({
            userid: values.mobile,
            otp: values.otp
          }));

          if (response?.payload?.success) {
            localStorage.setItem("data", JSON.stringify(response?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", response?.payload?.user?.role);
            localStorage.setItem("token", response?.payload?.token);
            navigate("/");
          } else {
            setLoginError(response?.payload?.message || "Invalid OTP");
          }
        }
      } catch (error) {
        setLoginError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      const response = await dispatch(sendOTP({ mobile: formik.values.mobile }));
      if (response?.payload?.success) {
        startCountdown();
      } else {
        setLoginError(response?.payload?.message || "Failed to resend OTP");
      }
    } catch (error) {
      setLoginError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Patient Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/patient/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loginError && (
            <div className="mb-4 bg-red-50 p-3 rounded-md text-red-600 text-sm">
              {loginError}
            </div>
          )}

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Mobile Number Field */}
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <div className="mt-1">
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  disabled={otpSent}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mobile}
                  className={`w-full px-3 py-2 border ${formik.touched.mobile && formik.errors.mobile
                      ? "border-red-300"
                      : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100`}
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.mobile}
                  </p>
                )}
              </div>
            </div>

            {/* OTP Field (shown only after OTP is sent) */}
            {otpSent && (
              <div>
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    OTP
                  </label>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || loading}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.otp}
                    className={`w-full px-3 py-2 border ${formik.touched.otp && formik.errors.otp
                        ? "border-red-300"
                        : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {formik.touched.otp && formik.errors.otp && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.otp}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? otpSent
                    ? "Verifying..."
                    : "Sending OTP..."
                  : otpSent
                    ? "Verify OTP"
                    : "Send OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileOTPLogin;