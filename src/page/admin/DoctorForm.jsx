import React, { useState } from 'react';
import { format, parseISO, addDays, addWeeks, addMonths } from 'date-fns';
import Dashboard from '../../components/Layout/Dashboard';
import { useDispatch } from 'react-redux';
import { RegisterDoctor } from '../../Redux/doctorSlice';
import { useParams } from 'react-router-dom';

const DoctorForm = ({ doctorData }) => {
  const [previewImage, setImagePreview] = useState("");
  const dispatch = useDispatch();
  const { hospitalId } = useParams()
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

  const specialties = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
    "Dermatology", "Oncology", "Psychiatry", "General Medicine"
  ];

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
      // Add time to existing date
      const updatedSlots = [...doctor.availableSlots];
      if (!updatedSlots[existingDateIndex].slots.includes(newSlotTime)) {
        updatedSlots[existingDateIndex].slots.push(newSlotTime);
        updatedSlots[existingDateIndex].slots.sort((a, b) => {
          return timeSlots.indexOf(a) - timeSlots.indexOf(b);
        });
      }
      setDoctor(prev => ({ ...prev, availableSlots: updatedSlots }));
    } else {
      // Add new date with time
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
        // Add times to existing date
        recurringSlots.forEach(time => {
          if (!updatedSlots[existingDateIndex].slots.includes(time)) {
            updatedSlots[existingDateIndex].slots.push(time);
          }
        });
        updatedSlots[existingDateIndex].slots.sort((a, b) =>
          timeSlots.indexOf(a) - timeSlots.indexOf(b)
        );
      } else {
        // Add new date with times
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

    // Reset bulk add state
    setRecurringSlots([]);
    setSelectedDays([]);
  };

  const handleRemoveSlot = (dateIndex, timeIndex) => {
    const updatedSlots = [...doctor.availableSlots];
    updatedSlots[dateIndex].slots.splice(timeIndex, 1);

    // Remove date if no slots left
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
    const formData = new FormData();
    const slots = []
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
    // formData.append('availableSlots', JSON.stringify(doctor.availableSlots));
    if (doctor.availableSlots && Array.isArray(doctor.availableSlots)) {
      doctor.availableSlots.forEach((slot, index) => {
          const slots = JSON.stringify(slot)
          console.log(slots)
        formData.append(`availableSlots[${index}]`,slots);
      });
    }

    console.log(slots)

    // setIsSubmitting(true);
    // console.log("Submitting:", formData);
    const res = await dispatch(RegisterDoctor(formData))
    // const res = await dispatch(RegisterDoctor(doctor))

    // API call would go here
    // setTimeout(() => setIsSubmitting(false), 1500);
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
    // getting the image
    const uploadedImage = event.target.files[0];
    //  console.log(uploadedImage)
    // if image exists then getting the url link of it
    // doctor, setDoctor
    if (uploadedImage) {
      setDoctor({
        ...doctor,
        photo: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        // console.log(this.result)
        setImagePreview(this.result);
      });
    }
  };

  return (
    <Dashboard>
      <div className="min-h-screen bg-gray-50  px-4 ">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Form Header */}
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {doctor.id ? 'Edit Doctor Profile' : 'Add New Doctor'}
              </h1>
              <p className="text-indigo-100">
                {doctor.id ? `Managing ${doctor.name}` : 'Create a new doctor profile'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                className="bg-green-500 bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                View All Doctors
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('basic')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'basic'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Basic Information
              </button>
              <button
                onClick={() => setActiveTab('professional')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'professional'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Professional Details
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'availability'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Availability
              </button>
            </nav>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Photo Upload */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          className="h-40 w-40 rounded-full object-cover border-4 border-indigo-100"
                          src={previewImage || 'https://via.placeholder.com/150'}
                          alt="profile"
                        />
                        <input
                          hidden
                          onChange={getImage}
                          id="file"  // Added id to match htmlFor
                          type="file"
                          className="absolute bottom-0 right-0 opacity-0 w-10 h-10 cursor-pointer"
                        />
                        <label
                          htmlFor="file"
                          className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </label>
                      </div>
                    </div>
                    {/* <input
                      type="text"
                      name="photo"
                      value={doctor.photo}
                      onChange={handleChange}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Image URL"
                    /> */}
                  </div>

                  {/* Basic Info */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={doctor.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Dr. Full Name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email ID
                        </label>
                        <input
                          type="text"
                          id="email"
                          name="email"
                          value={doctor.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Hospital Email"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="text"
                          id="password"
                          name="password"
                          value={doctor.password}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Hospital Email"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={doctor.status}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="onleave">On Leave</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Professional Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={doctor.bio}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Brief professional bio..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'professional' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <select
                      id="specialty"
                      name="specialty"
                      value={doctor.specialty}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      {specialties.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      id="qualification"
                      name="qualification"
                      value={doctor.qualification}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="MD, PhD, etc."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee (₹)
                    </label>
                    <input
                      type="number"
                      id="consultationFee"
                      name="consultationFee"
                      min="0"
                      value={doctor.consultationFee}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <div className="ml-3 flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Manage Availability
                  </h3>

                  <div className="flex space-x-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setBulkAddMode(false)}
                      className={`px-4 py-2 rounded-md ${!bulkAddMode
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      Single Day
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkAddMode(true)}
                      className={`px-4 py-2 rounded-md ${bulkAddMode
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      Multiple Days
                    </button>
                  </div>

                  {!bulkAddMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label htmlFor="slotDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          id="slotDate"
                          value={newSlotDate}
                          onChange={(e) => setNewSlotDate(e.target.value)}
                          min={format(new Date(), 'yyyy-MM-dd')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="slotTime" className="block text-sm font-medium text-gray-700 mb-1">
                          Time Slot
                        </label>
                        <select
                          id="slotTime"
                          value={newSlotTime}
                          onChange={(e) => setNewSlotTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select a time</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleAddSlot}
                          disabled={!newSlotDate || !newSlotTime}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Slot
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="startDate"
                            value={newSlotDate}
                            onChange={(e) => setNewSlotDate(e.target.value)}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                            Duration
                          </label>
                          <select
                            id="duration"
                            value={bulkAddDuration}
                            onChange={(e) => setBulkAddDuration(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="1week">1 Week</option>
                            <option value="2weeks">2 Weeks</option>
                            <option value="1month">1 Month</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Days of Week
                        </label>
                        <div className="flex space-x-2">
                          {weekDays.map(day => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleDaySelection(day)}
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedDays.includes(day)
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Slots
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => toggleRecurringSlot(time)}
                              className={`py-2 px-3 rounded-md text-sm ${recurringSlots.includes(time)
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleBulkAdd}
                          disabled={!newSlotDate || selectedDays.length === 0 || recurringSlots.length === 0}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add {selectedDays.length} Day(s) × {recurringSlots.length} Slot(s)
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {doctor.availableSlots.length > 0 ? (
                      doctor.availableSlots.map((daySlot, dateIndex) => (
                        <div key={daySlot.date} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b">
                            <h4 className="font-medium text-gray-700">
                              {format(parseISO(daySlot.date), 'EEEE, MMMM do yyyy')}
                            </h4>
                          </div>
                          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {daySlot.slots.map((time, timeIndex) => (
                              <div key={time} className="flex items-center justify-between bg-indigo-50 text-indigo-800 px-3 py-2 rounded">
                                <span>{time}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(dateIndex, timeIndex)}
                                  className="text-indigo-600 hover:text-indigo-800"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No availability slots added yet
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-indigo-800 mb-2">
                    Quick Add Next 7 Days
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {generateNext7Days().map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setNewSlotDate(format(day, 'yyyy-MM-dd'))}
                        className={`px-3 py-1 text-sm rounded ${newSlotDate === format(day, 'yyyy-MM-dd')
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                          }`}
                      >
                        {format(day, 'EEE')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Form Footer */}
            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
              <div>
                {activeTab !== 'basic' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === 'professional' ? 'basic' : 'professional')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                {activeTab !== 'availability' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === 'basic' ? 'professional' : 'availability')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Doctor Profile'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

// Example usage with your data
const exampleDoctor = {
  id: 'doc-1',
  hospitalId: 'hosp-1',
  name: 'Dr. Anita Sharma',
  specialty: 'Cardiology',
  qualification: 'MD, DM Cardiology',
  experience: 15,
  photo: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  bio: 'Dr. Anita Sharma is a senior cardiologist with extensive experience in treating complex cardiac conditions. She specializes in interventional cardiology and has performed over 1000 angioplasties.',
  rating: 4.8,
  consultationFee: 500,
  availableSlots: [
    {
      date: '2025-07-01',
      slots: ['10:00 AM', '11:00 AM', '12:00 PM', '4:00 PM', '5:00 PM']
    },
    {
      date: '2025-07-02',
      slots: ['9:00 AM', '10:00 AM', '11:00 AM', '3:00 PM', '4:00 PM']
    },
    {
      date: '2025-07-03',
      slots: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
    }
  ],
  status: 'active'
};

export default DoctorForm