import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllHospital } from '../../Redux/hospitalSlice';
import { getAllDoctors, GetDoctor, GetDoctorHospitalId } from '../../Redux/doctorSlice';
import axiosInstance from '../../Helper/axiosInstance';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppointmentCreate } from '../../Redux/appointment';
import Dashboard from '../../components/Layout/Dashboard';

function BookAppointment() {
  const dispatch = useDispatch()
  const hospitals = useSelector((state) => state.hospitals.hospitals);
  const [formData, setFormData] = useState({
    patient: '',
    mobile: '',
    dob: '',
    hospitalId: '',
    doctorId: '',
    date: '',
    slot: '',
    booking_amount: 0,
    paymentStatus: 'Pending'
  });

  const [hospital, setHospital] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState({
    hospitals: false,
    doctors: false,
    slots: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch hospitals on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(prev => ({ ...prev, hospitals: true }));
        const response = await axiosInstance.get('/api/hospitals');
        setHospital(response.data);
        setLoading(prev => ({ ...prev, hospitals: false }));
      } catch (err) {
        setError('Failed to load hospitals');
        setLoading(prev => ({ ...prev, hospitals: false }));
      }
    };
    fetchHospitals();
  }, []);

  // Fetch doctors when hospital is selected
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!formData.hospitalId) return;
      try {
        setLoading(prev => ({ ...prev, doctors: true }));
        const response = await dispatch(GetDoctorHospitalId(formData.hospitalId))
        setDoctors(response.payload);
        setLoading(prev => ({ ...prev, doctors: false }));
      } catch (err) {
        setError('Failed to load doctors');
        setLoading(prev => ({ ...prev, doctors: false }));
      }
    };
    fetchDoctors();
  }, [formData.hospitalId]);

  // Fetch available slots when doctor is selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!formData.doctorId) return;

      try {
        setLoading(prev => ({ ...prev, slots: true }));
        const response = await dispatch(GetDoctor(formData.doctorId))
        setAvailableSlots(response.payload.availableSlots || []);
        setLoading(prev => ({ ...prev, slots: false }));
      } catch (err) {
        setError('Failed to load available slots');
        setLoading(prev => ({ ...prev, slots: false }));
      }
    };
    fetchAvailableSlots();
  }, [formData.doctorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date ? date.toISOString().split('T')[0] : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // const response = await axiosInstance.post('/api/appointments', formData);
      const response = await dispatch(AppointmentCreate(formData))
      if (response.payload.success) {

        setSuccess(`Appointment booked successfully! Token: ${response.payload.savedAppointment.token}`);
      }
      // console.log(response.payload.savedAppointment.token)
      // Reset form
      // setFormData({
      //   patient: '',
      //   mobile: '',
      //   dob: '',
      //   hospitalId: '',
      //   doctorId: '',
      //   date: '',
      //   slot: '',
      //   booking_amount: 0,
      //   paymentStatus: 'Pending'
      // });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  // Custom class for available dates
  const dayClassName = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const isAvailable = availableSlots.some(slot => slot.date === dateStr);
    return isAvailable ? 'bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100' : '';
  };

  useEffect(() => {
    dispatch(getAllHospital()),
      dispatch(getAllDoctors())
  }, [])

  return (
    <Dashboard>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Book Appointment</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="patient"
                value={formData.patient}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                required
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                required
                pattern="[0-9]{10}"
                placeholder="9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Optional)</label>
              <DatePicker
                selected={formData.dob ? new Date(formData.dob) : null}
                onChange={(date) => handleChange({ target: { name: "dob", value: date ? date.toISOString().split('T')[0] : '' } })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholderText="Select date"
                maxDate={new Date()}
                showYearDropdown
                dropdownMode="select"
              />
            </div>
          </div>

          {/* Hospital & Doctor Selection */}
          <div className="space-y-4 bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Appointment Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
              <select
                name="hospitalId"
                value={formData.hospitalId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 appearance-none"
                required
                disabled={loading.hospitals}
              >
                <option value="">Select Hospital</option>
                {hospitals.map(h => (
                  <option key={h._id} value={h._id}>
                    {h.name}
                  </option>
                ))}
              </select>
              {loading.hospitals && (
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading hospitals...
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 appearance-none"
                required
                disabled={!formData.hospitalId || loading.doctors}
              >
                <option value="">Select Doctor</option>
                {doctors?.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} ({doctor.specialty})
                  </option>
                ))}
              </select>
              {loading.doctors && (
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading doctors...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Schedule Appointment</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Appointment Date <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <DatePicker
                  selected={formData.date ? new Date(formData.date) : null}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  disabled={!formData.doctorId}
                  className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${!formData.doctorId
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  required
                  placeholderText="Select appointment date"
                  dayClassName={dayClassName}
                  highlightDates={availableSlots.map(slot => new Date(slot.date))}
                  popperClassName="z-50"
                  popperPlacement="bottom-start"
                  showPopperArrow={false}
                  calendarClassName="shadow-lg rounded-lg border border-gray-200"
                />

                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {!formData.doctorId ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {!formData.doctorId && (
                  <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      Select doctor first
                    </span>
                  </div>
                )}
              </div>

              {formData.doctorId && !formData.date && availableSlots.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-start text-sm text-gray-600">
                    <svg className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-700">Available dates:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {availableSlots.slice(0, 5).map((s) => (
                          <button
                            type="button"
                            key={s._id}
                            onClick={() => handleDateChange(new Date(s.date))}
                            className="text-xs px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors border border-emerald-100"
                          >
                            {new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </button>
                        ))}
                        {availableSlots.length > 5 && (
                          <span className="text-xs text-gray-500 self-center">+{availableSlots.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Time Slot <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  name="slot"
                  value={formData.slot}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${!formData.date || loading.slots
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  required
                  disabled={!formData.date || loading.slots}
                >
                  <option value="">Select a time slot</option>
                  {formData.date &&
                    availableSlots
                      .find(day => day.date === formData.date)
                      ?.slots?.map((slot) => (
                        <option
                          key={`${formData.date}-${slot}`}
                          value={slot}
                          className="text-gray-900"
                        >
                          {slot}
                        </option>
                      ))}
                </select>

                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {loading.slots ? (
                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Status indicators */}
              <div className="min-h-5 mt-2">
                {loading.slots ? (
                  <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Fetching available time slots...
                  </div>
                ) : formData.date && !availableSlots.find(day => day.date === formData.date)?.slots?.length ? (
                  <div className="flex items-center text-sm text-rose-600 bg-rose-50 px-3 py-1.5 rounded-md">
                    <svg className="h-4 w-4 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    No available slots for this date
                  </div>
                ) : formData.date && (
                  <div className="flex items-center text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">
                    <svg className="h-4 w-4 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {availableSlots.find(day => day.date === formData.date)?.slots.length} slots available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 col-span-full">Payment Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                name="booking_amount"
                value={formData.booking_amount}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 appearance-none"
              required
            >
              
            
              <option value="Cash" selected>Complete (Cash)</option>
              <option value="online">Complete (Online)</option>
            
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={Object.values(loading).some(v => v)}
          >
            {Object.values(loading).some(v => v) ? (
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
  )
}

export default BookAppointment