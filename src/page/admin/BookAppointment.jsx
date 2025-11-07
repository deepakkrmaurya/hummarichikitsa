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
   const [selectDoctor,setDoctor]=useState({})
  // State management
  const [formData, setFormData] = useState({
    patient: '',
    mobile: '',
    dob: '',
    doctorId: '',
    booking_amount: '',
    paymentStatus: 'Cash'
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [hospitalId, setHospitalId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [activeSection, setActiveSection] = useState('patient');
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
        if (hospitalId === undefined) {
          hospitalId = response?.data?.user?._id
        }
        console.log(hospitalId)
        setHospitalId(hospitalId);

        const doctorsResponse = await dispatch(GetDoctorHospitalId(hospitalId));
        setDoctors(doctorsResponse?.payload?.doctors || []);
       
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
    if(name==='doctorId'){
      const doc = doctors.filter((d)=>d._id===value)
      //  console.log(doc[0].consultationFee)
       setFormData({
        ...formData,
        booking_amount:doc[0].consultationFee
       })
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  console.log(formData)
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
        <div className="flex justify-center   items-center h-full">
          <span class="Loader"></span>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
          <h2 className="text-xl font-bold">Book Appointment</h2>
          <p className="text-blue-100 text-sm mt-1">Schedule a visit with our healthcare professionals</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-white px-4">
          {['patient', 'appointment', 'payment'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-3 text-sm font-medium capitalize flex items-center ${activeSection === section ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {section === 'patient' && (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              )}
              {section === 'appointment' && (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              )}
              {section === 'payment' && (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              )}
              {section}
            </button>
          ))}
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Error and Success Messages */}
          {errors.form && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-center text-sm">
              <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errors.form}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-center text-sm">
              <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Patient Information Section */}
            {(activeSection === 'patient') && (
              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Patient Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="patient"
                    value={formData.patient}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${errors.patient ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Enter patient's full name"
                  />
                  {errors.patient && <p className="mt-1 text-xs text-red-600">{errors.patient}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${errors.mobile ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="10-digit mobile number"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,10}$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                  />
                  {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="Patient's age"
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSection('appointment')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    Next: Appointment Details
                  </button>
                </div>
              </div>
            )}

            {/* Appointment Details Section */}
            {(activeSection === 'appointment') && (
              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Appointment Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm appearance-none ${errors.doctorId ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    disabled={loading.doctors}
                  >
                    <option value="">Select a Doctor</option>
                    {doctors?.map(doctor => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name} ({doctor.specialty})
                      </option>
                    ))}
                  </select>
                  {errors.doctorId && <p className="mt-1 text-xs text-red-600">{errors.doctorId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDate(today)}
                      className={`p-2 rounded-lg font-medium text-sm transition-all ${selectedDate === today
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                        }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDate(tomorrowFormatted)}
                      className={`p-2 rounded-lg font-medium text-sm transition-all ${selectedDate === tomorrowFormatted
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                        }`}
                    >
                      Tomorrow
                    </button>
                  </div>
                  {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSection('patient')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  >
                    Back to Patient Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('payment')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    Next: Payment
                  </button>
                </div>
              </div>
            )}

            {/* Payment Information Section */}
            {(activeSection === 'payment') && (
              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Payment Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Amount *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">₹</span>
                      </div>
                      <input
                        type="text"
                        name="booking_amount"
                        disabled={formData.booking_amount ? true : false}
                        value={formData.booking_amount}
                        placeholder='0'
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleChange(e);
                          }
                        }}
                        className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 text-sm ${errors.booking_amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                        min=""
                        step="0.01"
                      />
                      {errors.booking_amount && <p className="mt-1 text-xs text-red-600">{errors.booking_amount}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                    <select
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none"
                    >
                      <option value="Cash">Cash</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSection('appointment')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  >
                    Back to Appointment
                  </button>
                  <button
                    type="submit"
                    disabled={loading.submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading.submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                        Book Appointment
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </Dashboard>
  );
}

export default BookAppointment;