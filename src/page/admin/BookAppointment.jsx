import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetDoctorHospitalId } from '../../Redux/doctorSlice';
import { AppointmentCreate } from '../../Redux/appointment';
import Dashboard from '../../components/Layout/Dashboard';
import axiosInstance from '../../Helper/axiosInstance';

function BookAppointment() {
  // Date handling
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  // State management
  const [formData, setFormData] = useState({
    patient: '',
    mobile: '',
    dob: '',
    doctorId: '',
    booking_amount: 0,
    paymentStatus: 'Cash'
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [hospitalId, setHospitalId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState({
    doctors: false,
    submitting: false
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const dispatch = useDispatch();

  // Fetch doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(prev => ({ ...prev, doctors: true }));
        const response = await axiosInstance.get("/user/me");

        var hospitalId = response?.data?.hospital?._id;
        // console.log(hospitalId)
        if (hospitalId === undefined) {
          hospitalId = response?.data?.user?._id
        }
        setHospitalId(hospitalId);

        const doctorsResponse = await dispatch(GetDoctorHospitalId(hospitalId));
        setDoctors(doctorsResponse?.payload || []);
      } catch (err) {
        setErrors(prev => ({ ...prev, doctors: 'Failed to load doctors' }));
      } finally {
        setLoading(prev => ({ ...prev, doctors: false }));
      }
    };

    fetchDoctors();
  }, [dispatch]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient.trim()) newErrors.patient = 'Patient name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile number';
    if (!formData.doctorId) newErrors.doctorId = 'Please select a doctor';
    if (!selectedDate) newErrors.date = 'Please select a date';
    if (formData.booking_amount <= 0) newErrors.booking_amount = 'Invalid amount';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(prev => ({ ...prev, submitting: true }));

      const appointmentData = {
        ...formData,
        hospitalId,
        date: selectedDate
      };

      const response = await dispatch(AppointmentCreate(appointmentData));

      if (response.payload?.success) {
        setSuccess(`Appointment booked successfully! Token: ${response.payload.savedAppointment.token}`);

        // Reset form
        setFormData({
          patient: '',
          mobile: '',
          dob: '',
          doctorId: '',
          booking_amount: 0,
          paymentStatus: 'Cash'
        });
        setSelectedDate('');
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.response?.data?.message || 'Failed to book appointment' }));
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  if (loading.doctors && doctors.length === 0) {
    return (
      <Dashboard>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className=" mx-auto  bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-1 text-center">Book Appointment</h2>

        {/* Error and Success Messages */}
        {errors.form && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errors.form}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Information */}
            <div className="space-y-4 bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Patient Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="patient"
                  value={formData.patient}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${errors.patient ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                  placeholder="John Doe"
                />
                {errors.patient && <p className="mt-1 text-sm text-red-600">{errors.patient}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${errors.mobile ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                  placeholder="9876543210"
                  onChange={(e) => {

                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                />
                {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age*</label>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}

                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  placeholder="Age or DOB"
                  required
                  onChange={(e) => {

                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                />
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4 bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Appointment Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-200 appearance-none ${errors.doctorId ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                  disabled={loading.doctors}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} ({doctor.specialty})
                    </option>
                  ))}
                </select>
                {errors.doctorId && <p className="mt-1 text-sm text-red-600">{errors.doctorId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date *</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDate(today)}
                    className={`flex-1 p-3 rounded-lg font-medium shadow-md transition-all ${selectedDate === today
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(tomorrowFormatted)}
                    className={`flex-1 p-3 rounded-lg font-medium shadow-md transition-all ${selectedDate === tomorrowFormatted
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                  >
                    Tomorrow
                  </button>
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 col-span-full">Payment Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Amount *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="text"
                  name="booking_amount"
                  value={formData.booking_amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${errors.booking_amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                  min="0"
                  step="0.01"
                />
                {errors.booking_amount && <p className="mt-1 text-sm text-red-600">{errors.booking_amount}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 appearance-none"
              >
                <option value="Cash">Cash</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading.submitting}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading.submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                  Book Appointment
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Dashboard>
  );
}

export default BookAppointment;