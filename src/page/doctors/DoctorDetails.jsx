import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { GetHospitalById } from '../../Redux/hospitalSlice';
import { useEffect } from 'react';
import { GetDoctor } from '../../Redux/doctorSlice';

const DoctorDetailsPage = () => {
  const { doctorId } = useParams();
  const dispatch = useDispatch()
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [doctor, setDoctor] = useState(null);

  // Mock data - in a real app, you would fetch this using the doctorId
//   const doctor = {
//     _id: "687be647d132d0647316e182",
//     name: "Indira Delgado",
//     email: "xaridaruca@mailinator.com",
//     role: "doctor",
//     specialty: "Dermatology",
//     qualification: "Ab duis voluptatem m",
//     experience: 5, // Assuming years since 527 seems too high
//     status: "active",
//     photo: "http://localhost:5000/public/1752950343206-5-WhatsApp Image 2025-04-03…",
//     bio: "Modi labore exercita",
//     rating: 4,
//     consultationFee: 82,
//     availableSlots: [
//       {
//         date: "2025-07-27",
//         slots: ["9:00 AM", "10:00 AM", "11:00 AM", "3:00 PM"],
//         _id: "687be647d132d0647316e183"
//       },
//       {
//         date: "2025-07-28",
//         slots: ["9:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"],
//         _id: "687be647d132d0647316e184"
//       }
//     ]
//   };
  const getDoctorById = async()=>{
     const res = await dispatch(GetDoctor(doctorId))

     setDoctor(res?.payload)
  }
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleBookAppointment = () => {
    if (selectedDate && selectedSlot) {
      alert(`Appointment booked with Dr. ${doctor?.name} on ${selectedDate} at ${selectedSlot}`);
      // Here you would typically make an API call to book the appointment
    }
  };

  useEffect(()=>{
       getDoctorById()
  },[])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 ">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Doctor Header */}
          <div className="md:flex">
            <div className=" p-6 flex justify-center">
              <img 
                className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg" 
                src={doctor?.photo} 
                alt={doctor?.name} 
              />
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dr. {doctor?.name}</h1>
                  <p className="text-indigo-600 font-medium">{doctor?.specialty}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  doctor?.status === 'active' 
                    ? 'bg-green-100 text-green-800 animate-pulse' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {doctor?.status}
                </span>
              </div>
              
              <div className="mt-4 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < doctor?.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">{doctor?.rating} out of 5</span>
                </div>
                <span className="mx-4 text-gray-300">|</span>
                <span className="text-gray-600">{doctor?.experience} years experience</span>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">About</h3>
                <p className="mt-2 text-gray-600">{doctor?.bio}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Qualification</h3>
                  <p className="mt-1 text-gray-600">{doctor?.qualification}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Consultation Fee</h3>
                  <p className="mt-1 text-gray-600">${doctor?.consultationFee}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Booking Section */}
          <div className="border-t border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Book Appointment</h2>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Available Dates</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {doctor?.availableSlots.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => handleDateSelect(slot?.date)}
                    className={`px-4 py-2 rounded-md ${
                      selectedDate === slot?.date
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {new Date(slot?.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Available Time Slots</h3>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {doctor?.availableSlots
                    .find(slot => slot?.date === selectedDate)
                    .slots.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSlot(time)}
                        className={`px-4 py-2 rounded-md ${
                          selectedSlot === time
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                </div>
              </div>
            )}

            
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            to={`/hospital/${doctor?.hospitalId}`} 
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Hospital
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
