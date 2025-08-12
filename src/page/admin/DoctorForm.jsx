import React, { useState } from 'react';
import { format, parseISO, addDays, addWeeks, addMonths } from 'date-fns';
import Dashboard from '../../components/Layout/Dashboard';
import { useDispatch } from 'react-redux';
import { RegisterDoctor } from '../../Redux/doctorSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaStar, FaUserMd, FaGraduationCap, FaMoneyBillWave, FaCheckCircle, FaPlus, FaTimes, FaUser, FaEnvelope, FaLock, FaStethoscope, FaBriefcaseMedical, FaCalendarCheck } from 'react-icons/fa';
import avatar from '../../../src/assets/logo-def.png';
const DoctorForm = ({ doctorData }) => {
  // Professional healthcare color palette
  const colors = {
    primary: '#3b82f6',       // Blue (trust, professionalism)
    secondary: '#60a5fa',     // Lighter blue
    accent: '#10b981',        // Green (health, success)
    background: '#f9fafb',    // Very light gray
    text: '#1f2937',          // Dark gray
    lightText: '#6b7280',     // Gray
    border: '#e5e7eb',        // Light border
    success: '#10b981',       // Green for success states
    warning: '#f59e0b',       // Orange for warnings
    error: '#ef4444',         // Red for errors
    cardBg: '#ffffff',        // White for cards
    inputBg: '#f3f4f6'       // Light gray for inputs
  };

  const [previewImage, setImagePreview] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hospitalId } = useParams();
  const [doctor, setDoctor] = useState(doctorData || {
    id: '',
    hospitalId: hospitalId,
    name: '',
    password: '',
    email: '',
    specialty: 'Cardiology',
    qualification: '',
    experience: 0,
    photo: '',
    bio: '',
    gender: '',
    rating: 0,
    consultationFee: 0,
    availableSlots: [],
    status: 'active'
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [bulkAddMode, setBulkAddMode] = useState(false);
  const [bulkAddDuration, setBulkAddDuration] = useState('1week');
  const [selectedDays, setSelectedDays] = useState([]);
  const [recurringSlots, setRecurringSlots] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // const specialties = [
  //   "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
  //   "Dermatology", "Oncology", "Psychiatry", "General Medicine"
  // ];

  const [newSpecialty, setNewSpecialty] = useState('');
  const [specialties, setSpecialties] = useState([
      "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
    "Dermatology", "Oncology", "Psychiatry", "General Medicine"
  ]);
  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty)) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSlot = () => {
    if (!newSlotDate) return;

    const existingDateIndex = doctor.availableSlots.findIndex(
      slot => slot.date === newSlotDate
    );

    if (existingDateIndex >= 0) {
      const updatedSlots = [...doctor.availableSlots];
      if (!updatedSlots[existingDateIndex].slots.includes(newSlotTime)) {
        updatedSlots[existingDateIndex].slots.push(newSlotTime);
        updatedSlots[existingDateIndex].slots.sort((a, b) => {
          return timeSlots.indexOf(a) - timeSlots.indexOf(b);
        });
      }
      setDoctor(prev => ({ ...prev, availableSlots: updatedSlots }));
    } else {
      setDoctor(prev => ({
        ...prev,
        availableSlots: [
          ...prev.availableSlots,
          { date: newSlotDate, slots: [newSlotTime] }
        ].sort((a, b) => new Date(a.date) - new Date(b.date))
      }));
    }

    setNewSlotTime('');
  };

  const handleBulkAdd = () => {
    if (!newSlotDate || recurringSlots.length === 0) return;

    let endDate;
    const startDate = parseISO(newSlotDate);

    switch (bulkAddDuration) {
      case '1week':
        endDate = addDays(startDate, 6);
        break;
      case '2weeks':
        endDate = addDays(startDate, 13);
        break;
      case '1month':
        endDate = addMonths(startDate, 1);
        break;
      default:
        endDate = addDays(startDate, 6);
    }

    const datesToAdd = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const dayOfWeek = format(currentDate, 'EEE');
      if (selectedDays.includes(dayOfWeek)) {
        datesToAdd.push(format(currentDate, 'yyyy-MM-dd'));
      }
      currentDate = addDays(currentDate, 1);
    }

    const updatedSlots = [...doctor.availableSlots];

    datesToAdd.forEach(date => {
      const existingDateIndex = updatedSlots.findIndex(slot => slot.date === date);

      if (existingDateIndex >= 0) {
        recurringSlots.forEach(time => {
          if (!updatedSlots[existingDateIndex].slots.includes(time)) {
            updatedSlots[existingDateIndex].slots.push(time);
          }
        });
        updatedSlots[existingDateIndex].slots.sort((a, b) =>
          timeSlots.indexOf(a) - timeSlots.indexOf(b)
        );
      } else {
        updatedSlots.push({
          date,
          slots: [...recurringSlots].sort((a, b) =>
            timeSlots.indexOf(a) - timeSlots.indexOf(b)
          )
        });
      }
    });

    setDoctor(prev => ({
      ...prev,
      availableSlots: updatedSlots.sort((a, b) =>
        new Date(a.date) - new Date(b.date)
      )
    }));

    setRecurringSlots([]);
    setSelectedDays([]);
  };

  const handleRemoveSlot = (dateIndex, timeIndex) => {
    const updatedSlots = [...doctor.availableSlots];
    updatedSlots[dateIndex].slots.splice(timeIndex, 1);

    if (updatedSlots[dateIndex].slots.length === 0) {
      updatedSlots.splice(dateIndex, 1);
    }

    setDoctor(prev => ({ ...prev, availableSlots: updatedSlots }));
  };

  const toggleDaySelection = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const toggleRecurringSlot = (time) => {
    setRecurringSlots(prev =>
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('id', doctor.id);
    formData.append('hospitalId', doctor.hospitalId);
    formData.append('name', doctor.name);
    formData.append('password', doctor.password);
    formData.append('email', doctor.email);
    formData.append('specialty', doctor.specialty);
    formData.append('qualification', doctor.qualification);
    formData.append('experience', doctor.experience.toString());
    formData.append('bio', doctor.bio);
    formData.append('rating', doctor.rating.toString());
    formData.append('consultationFee', doctor.consultationFee.toString());
    formData.append('status', doctor.status);
    formData.append('photo', doctor.photo);
    formData.append('gender', doctor.gender);

    if (doctor.availableSlots && Array.isArray(doctor.availableSlots)) {
      doctor.availableSlots.forEach((slot, index) => {
        formData.append(`availableSlots[${index}]`, JSON.stringify(slot));
      });
    }

    try {

      await dispatch(RegisterDoctor(formData));
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      navigate(-1)
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      days.push(addDays(today, i));
    }
    return days;
  };

  const getImage = (event) => {
    event.preventDefault();
    const uploadedImage = event.target.files[0];
    if (uploadedImage) {
      setDoctor({
        ...doctor,
        photo: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setImagePreview(this.result);
      });
    }
  };

  return (
    <Dashboard>
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Notification */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-sm flex items-center"
              >
                <FaCheckCircle className="mr-2 text-green-500" />
                <span>Doctor profile saved successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border"
            style={{
              borderColor: colors.border,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* Form Header */}
            <div
              className="px-6 py-4 flex justify-between items-center"
              style={{
                backgroundColor: '#2B6CB0',
                backgroundImage: ''
              }}
            >
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {doctor.id ? 'Edit Doctor Profile' : 'Add New Doctor'}
                </h1>
                <p className="text-blue-100 opacity-90">
                  {doctor.id ? `Managing ${doctor.name}` : 'Create a new doctor profile'}
                </p>
              </div>
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className=" bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center"
              >
                <FaArrowLeft className="mr-2" />
                View All Doctors
              </motion.button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b" style={{ borderColor: colors.border }}>
              <nav className="flex -mb-px">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('basic')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${activeTab === 'basic'
                    ? `border-${colors.primary} text-${colors.primary}`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <FaUser className="mr-2" />
                  Basic Information
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('professional')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${activeTab === 'professional'
                    ? `border-${colors.primary} text-${colors.primary}`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <FaBriefcaseMedical className="mr-2" />
                  Professional Details
                </motion.button>
                {/* <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('availability')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${activeTab === 'availability'
                    ? `border-${colors.primary} text-${colors.primary}`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <FaCalendarCheck className="mr-2" />
                  Availability
                </motion.button> */}
              </nav>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'basic' && (
                  <motion.div
                    key="basic"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Photo Upload */}
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          Profile Photo
                        </label>
                        <div className="flex items-center">
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="relative"
                          >
                            <img
                              className="h-40 w-40 rounded-full object-cover border-4 shadow-md"
                              style={{
                                borderColor: colors.primary,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              }}
                              src={previewImage || avatar}
                              alt="profile"
                            />
                            <input
                              hidden
                              onChange={getImage}
                              id="file"
                              type="file"
                              className="absolute bottom-0 right-0 opacity-0 w-10 h-10 cursor-pointer"
                            />
                            <motion.label
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              htmlFor="file"
                              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm cursor-pointer"
                              style={{
                                color: colors.primary,
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                              }}
                            >
                              <FaPlus />
                            </motion.label>
                          </motion.div>
                        </div>
                      </div>

                      {/* Basic Info */}
                      <div className="md:col-span-2 space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaUserMd style={{ color: colors.lightText }} />
                            </div>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={doctor.name}
                              onChange={handleChange}
                              className="pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                              style={{
                                borderColor: colors.border,
                                backgroundColor: colors.inputBg,
                                focusRing: colors.primary
                              }}
                              placeholder="Dr. Full Name"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                              Email ID
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope style={{ color: colors.lightText }} />
                              </div>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={doctor.email}
                                onChange={handleChange}
                                className="pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                                style={{
                                  borderColor: colors.border,
                                  backgroundColor: colors.inputBg,
                                  focusRing: colors.primary
                                }}
                                placeholder="doctor@example.com"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                              Password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock style={{ color: colors.lightText }} />
                              </div>
                              <input
                                type="password"
                                id="password"
                                name="password"
                                value={doctor.password}
                                onChange={handleChange}
                                className="pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                                style={{
                                  borderColor: colors.border,
                                  backgroundColor: colors.inputBg,
                                  focusRing: colors.primary
                                }}
                                placeholder="••••••••"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="status" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                            Status
                          </label>
                          <select
                            id="status"
                            name="status"
                            value={doctor.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: colors.inputBg,
                              focusRing: colors.primary
                            }}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="onleave">On Leave</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="gender" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                            Gender
                          </label>
                          <select
                            id="gender"
                            name="gender"
                            value={doctor.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: colors.inputBg,
                              focusRing: colors.primary
                            }}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>

                          </select>
                        </div>

                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                            Professional Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={doctor.bio}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: colors.inputBg,
                              focusRing: colors.primary
                            }}
                            placeholder="Brief professional bio..."
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'professional' && (
                  <motion.div
                    key="professional"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="specialty" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                          Specialty
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaStethoscope style={{ color: colors.lightText }} />
                          </div>
                          <select
                            id="specialty"
                            name="specialty"
                            value={doctor.specialty}
                            onChange={handleChange}
                            className="pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: colors.inputBg,
                              focusRing: colors.primary
                            }}
                            required
                          >
                            {specialties.map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                          </select>
                        </div>

                        {/* Add new specialty input */}
                        <div className="mt-2 flex">
                          <input
                            type="text"
                            value={newSpecialty}
                            onChange={(e) => setNewSpecialty(e.target.value)}
                            placeholder="Add new specialty"
                            className="flex-1 px-3 py-2 border rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: colors.inputBg,
                              focusRing: colors.primary
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={handleAddSpecialty}
                            disabled={!newSpecialty.trim()}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-r-md shadow-sm disabled:opacity-50"
                          >
                            <FaPlus />
                          </motion.button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="qualification" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                          Qualification
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaGraduationCap style={{ color: colors.lightText }} />
                          </div>
                          <input
                            type="text"
                            id="qualification"
                            name="qualification"
                            value={doctor.qualification}
                            onChange={handleChange}
                            className="pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: colors.inputBg,
                              focusRing: colors.primary
                            }}
                            placeholder="MD, PhD, etc."
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                          Experience (years)
                        </label>
                        <input
                          type="number"
                          id="experience"
                          name="experience"
                          min="0"
                          max="50"
                          value={doctor.experience}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: colors.inputBg,
                            focusRing: colors.primary
                          }}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="consultationFee" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                          Consultation Fee (₹)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaMoneyBillWave style={{ color: colors.lightText }} />
                          </div>
                          <input
                            type="number"
                            id="consultationFee"
                            name="consultationFee"
                            min="0"
                            value={doctor.consultationFee}
                            onChange={handleChange}
                            className="pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: colors.inputBg,
                              focusRing: colors.primary
                            }}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="rating" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                          Rating
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            id="rating"
                            name="rating"
                            min="0"
                            max="5"
                            step="0.1"
                            value={doctor.rating}
                            onChange={handleChange}
                            className="w-20 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: colors.inputBg,
                              focusRing: colors.primary
                            }}
                          />
                          <div className="ml-3 flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-lg ${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* {activeTab === 'availability' && (
                  <motion.div
                    key="availability"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="bg-white shadow rounded-lg p-6 border" style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.cardBg
                    }}>
                      <h3 className="text-lg font-medium mb-4" style={{ color: colors.text }}>
                        Manage Availability
                      </h3>

                      <div className="flex space-x-4 mb-6">
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setBulkAddMode(false)}
                          className={`px-4 py-2 rounded-md flex items-center transition-colors ${!bulkAddMode
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          <FaCalendarAlt className="mr-2" />
                          Single Day
                        </motion.button>
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setBulkAddMode(true)}
                          className={`px-4 py-2 rounded-md flex items-center transition-colors ${bulkAddMode
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          <FaCalendarCheck className="mr-2" />
                          Multiple Days
                        </motion.button>
                      </div>

                      {!bulkAddMode ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                        >
                          <div>
                            <label htmlFor="slotDate" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                              Date
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaCalendarAlt style={{ color: colors.lightText }} />
                              </div>
                              <input
                                type="date"
                                id="slotDate"
                                value={newSlotDate}
                                onChange={(e) => setNewSlotDate(e.target.value)}
                                min={format(new Date(), 'yyyy-MM-dd')}
                                className="pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                                style={{ 
                                  borderColor: colors.border,
                                  backgroundColor: colors.inputBg,
                                  focusRing: colors.primary 
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="slotTime" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                              Time Slot
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaClock style={{ color: colors.lightText }} />
                              </div>
                              <select
                                id="slotTime"
                                value={newSlotTime}
                                onChange={(e) => setNewSlotTime(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                                style={{ 
                                  borderColor: colors.border,
                                  backgroundColor: colors.inputBg,
                                  focusRing: colors.primary 
                                }}
                              >
                                <option value="">Select a time</option>
                                {timeSlots.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex items-end">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={handleAddSlot}
                              disabled={!newSlotDate || !newSlotTime}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <FaPlus className="mr-2" />
                              Add Slot
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="startDate" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                Start Date
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FaCalendarAlt style={{ color: colors.lightText }} />
                                </div>
                                <input
                                  type="date"
                                  id="startDate"
                                  value={newSlotDate}
                                  onChange={(e) => setNewSlotDate(e.target.value)}
                                  min={format(new Date(), 'yyyy-MM-dd')}
                                  className="pl-10 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                                  style={{ 
                                    borderColor: colors.border,
                                    backgroundColor: colors.inputBg,
                                    focusRing: colors.primary 
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="duration" className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                Duration
                              </label>
                              <select
                                id="duration"
                                value={bulkAddDuration}
                                onChange={(e) => setBulkAddDuration(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                                style={{ 
                                  borderColor: colors.border,
                                  backgroundColor: colors.inputBg,
                                  focusRing: colors.primary 
                                }}
                              >
                                <option value="1week">1 Week</option>
                                <option value="2weeks">2 Weeks</option>
                                <option value="1month">1 Month</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                              Days of Week
                            </label>
                            <div className="flex space-x-2">
                              {weekDays.map(day => (
                                <motion.button
                                  key={day}
                                  whileHover={{ y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => toggleDaySelection(day)}
                                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedDays.includes(day)
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                  {day}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                              Time Slots
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {timeSlots.map(time => (
                                <motion.button
                                  key={time}
                                  whileHover={{ y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => toggleRecurringSlot(time)}
                                  className={`py-2 px-3 rounded-md text-sm transition-colors ${recurringSlots.includes(time)
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                  {time}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={handleBulkAdd}
                              disabled={!newSlotDate || selectedDays.length === 0 || recurringSlots.length === 0}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <FaPlus className="mr-2" />
                              Add {selectedDays.length} Day(s) × {recurringSlots.length} Slot(s)
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      <div className="space-y-4">
                        {doctor.availableSlots.length > 0 ? (
                          doctor.availableSlots.map((daySlot, dateIndex) => (
                            <motion.div 
                              key={daySlot.date}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border rounded-lg overflow-hidden"
                              style={{ 
                                borderColor: colors.border,
                                backgroundColor: colors.cardBg
                              }}
                            >
                              <div className="bg-gray-50 px-4 py-2 border-b" style={{ borderColor: colors.border }}>
                                <h4 className="font-medium" style={{ color: colors.text }}>
                                  {format(parseISO(daySlot.date), 'EEEE, MMMM do yyyy')}
                                </h4>
                              </div>
                                                            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                {daySlot.slots.map((time, timeIndex) => (
                                  <motion.div
                                    key={time}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative"
                                  >
                                    <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm flex items-center justify-between">
                                      <span>{time}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSlot(dateIndex, timeIndex)}
                                        className="text-blue-500 hover:text-blue-700 ml-2"
                                      >
                                        <FaTimes />
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8" style={{ color: colors.lightText }}>
                            <FaCalendarAlt className="mx-auto text-4xl mb-2" />
                            <p>No availability slots added yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )} */}
              </AnimatePresence>

              {/* Form Actions */}
              <div className="mt-8 pt-6 border-t flex justify-between" style={{ borderColor: colors.border }}>
                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'basic' ? 'basic' : activeTab === 'professional' ? 'basic' : 'professional')}
                  className="px-4 py-2 border rounded-md shadow-sm text-sm font-medium flex items-center"
                  style={{
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.inputBg
                  }}
                >
                  <FaArrowLeft className="mr-2" />
                  {activeTab === 'basic' ? 'Cancel' : 'Back'}
                </motion.button>

                {activeTab !== 'availability' ? (
                  <motion.button
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setActiveTab(activeTab === 'basic' ? 'professional' : 'availability')}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white flex items-center"
                    style={{
                      backgroundColor: colors.primary,
                      hoverBackgroundColor: colors.secondary
                    }}
                  >
                    Continue
                    <FaArrowLeft className="ml-2 transform rotate-180" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white flex items-center"
                    style={{
                      backgroundColor: isSubmitting ? colors.lightText : colors.accent,
                      hoverBackgroundColor: colors.success
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Save Doctor Profile
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </Dashboard>
  );
};

export default DoctorForm;