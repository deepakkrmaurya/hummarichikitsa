import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";

const BookAppointment = () => {
  const [loading, setLoading] = useState(false);

  // Formik & Yup Validation
  const formik = useFormik({
    initialValues: {
      patientName: "Jay",
      mobile: "91818181818",
      patientId: "687ca5b8946fcb91ca214265",
      doctorId: "687ca593946fcb91ca21416e",
      hospitalId: "687ca529946fcb91ca21415f",
      date: "2025-07-23",
      slot: "10:00 AM",
      status: "cancelled",
      paymentStatus: "pending",
      amount: 13,
    },
    validationSchema: Yup.object({
      patientName: Yup.string().required("Patient name is required"),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Invalid mobile number")
        .required("Mobile number is required"),
      date: Yup.date().required("Date is required"),
      slot: Yup.string().required("Time slot is required"),
      amount: Yup.number().required("Amount is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Handle form submission here
        console.log(values);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 py-4 px-6">
            <h2 className="text-2xl font-bold text-white">Patient Appointment Details</h2>
            <p className="text-blue-100 mt-1">Manage patient booking information</p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
            {/* Patient Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-blue-800 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                Patient Information
              </h3>
              
              <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      id="patientName"
                      name="patientName"
                      value={formik.values.patientName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formik.touched.patientName && formik.errors.patientName
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formik.touched.patientName && formik.errors.patientName && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.patientName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formik.touched.mobile && formik.errors.mobile
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formik.touched.mobile && formik.errors.mobile && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.mobile}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                    Patient ID
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="patientId"
                      name="patientId"
                      value={formik.values.patientId}
                      readOnly
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-blue-800 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Appointment Details
              </h3>
              
              <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Appointment Date
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formik.values.date}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formik.touched.date && formik.errors.date
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formik.touched.date && formik.errors.date && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.date}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="slot" className="block text-sm font-medium text-gray-700">
                    Time Slot
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <select
                      id="slot"
                      name="slot"
                      value={formik.values.slot}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formik.touched.slot && formik.errors.slot
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } rounded-md shadow-sm focus:outline-none sm:text-sm`}
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formik.touched.slot && formik.errors.slot && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.slot}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Appointment Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="status"
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information Section */}
            <div>
              <h3 className="text-lg font-medium text-blue-800 flex items-center">
                <CurrencyRupeeIcon className="h-5 w-5 mr-2 text-blue-600" />
                Payment Information
              </h3>
              
              <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Consultation Fee
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formik.touched.amount && formik.errors.amount
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
                    />
                  </div>
                  {formik.touched.amount && formik.errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.amount}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
                    Payment Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="paymentStatus"
                      name="paymentStatus"
                      value={formik.values.paymentStatus}
                      onChange={formik.handleChange}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information (Readonly) */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500 mb-2">System Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Doctor ID</p>
                  <p className="font-medium text-gray-900">{formik.values.doctorId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Hospital ID</p>
                  <p className="font-medium text-gray-900">{formik.values.hospitalId}</p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Update Appointment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



export default BookAppointment