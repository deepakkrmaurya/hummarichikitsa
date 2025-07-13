
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Star, Clock, Calendar, CreditCard, CheckCircle, Award, BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHospital } from '../Redux/hospitalSlice';
import { getAllDoctors } from '../Redux/doctorSlice';
import { useEffect, useState } from 'react';
import { AppointmentCreate } from '../Redux/appointment';
import Layout from '../components/Layout/Layout';


const DoctorDetailPage = () => {
        const dispatch = useDispatch();
    const currentUser = JSON.parse(localStorage.getItem('data')) || null;
    //  console.log("Current User:", currentUser);
    const isLoggdIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    const { doctorId } = useParams();
    // // alert(doctorId);
    const navigate = useNavigate();
    const hospitals = useSelector((state) => state.hospitals.hospitals);
    const { doctors } = useSelector((state) => state.doctors);
    const doctor = doctors.find(d => d?._id === doctorId);
    // console.log("Doctor data (Redux):", doctor?.hospitalId?._id);
    // console.log("Doctor data (Redux):", doctor);
    const hospital = doctor ? hospitals.find(h => h?._id === doctor?.hospitalId?._id) : null;
    // //    console.log("Hospital data (Redux):", hospital);
    const [selectedDate, setSelectedDate] = useState(doctor?.availableSlots[0]?.date || '');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

    // if (!doctor || !hospital) {
    //     return (
    //         <div className="container mx-auto px-4 py-16 text-center">
    //             <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor not found</h2>
    //             <button
    //                 onClick={() => navigate('/hospitals')}
    //                 className="text-blue-600 hover:text-blue-800 font-medium"
    //             >
    //                 Back to Hospitals
    //             </button>
    //         </div>
    //     );
    // }

    const availableSlots = doctor?.availableSlots.find(as => as.date === selectedDate)?.slots || [];

    const handleBooking = async() => {
        if (!isLoggdIn) {
            alert('Please log in to book an appointment');
            return;
        }
        
        if (!selectedDate || !selectedSlot) {
            alert('Please select a date and time slot');
            return;
        }
        

        const newAppointment = {
            patientId: currentUser?._id,
            doctorId: doctor?._id,
            hospitalId: hospital?._id,
            date: selectedDate,
            slot: selectedSlot,
            amount: doctor?.consultationFee,
            createdAt: new Date().toISOString()
        };
       
         const res = await dispatch(AppointmentCreate(newAppointment));
        if (res?.payload?.success) {
             setTimeout(() => {
            navigate(`/payment/${res?.payload?.appointment._id}`);
        }, 1500);
        }
        // setIsBookingConfirmed(true);

        // Navigate to payment page after a short delay
        // setTimeout(() => {
        //     navigate(`/payment/${newAppointment.id}`);
        // }, 1500);
    };


    useEffect(() => {

        (
            async () => {
                await dispatch(getAllHospital())
                await dispatch(getAllDoctors())
            }
        )()
    }, []);

    return (
        <Layout>
        <div className="container mx-auto px-4 py-8">
            {/* Doctor Profile Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 flex justify-center md:justify-start mb-6 md:mb-0">
                            <img
                                src={doctor?.photo}
                                alt={doctor?.name}
                                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        </div>
                        <div className="md:w-3/4 md:pl-6">
                            <h1 className="text-2xl font-bold mb-2">{doctor?.name}</h1>
                            <p className="text-blue-100 font-medium mb-3">{doctor?.specialty}</p>
                            <p className="text-white mb-3">{doctor?.qualification} • {doctor?.experience} Years Experience</p>

                            <div className="flex items-center mb-4">
                                <div className="bg-white bg-opacity-20 rounded-md px-3 py-1 flex items-center">
                                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                                    <span className="font-semibold">{doctor?.rating}</span>
                                    <span className="text-sm ml-1 text-blue-100">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 text-blue-200 mr-2" />
                                <span className="text-white">{hospital?.name}, {hospital?.city}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Doctor Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                            About
                        </h2>
                        <p className="text-gray-600">{doctor?.bio}</p>
                    </div>

                    {/* Experience & Qualifications */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Award className="h-5 w-5 text-blue-600 mr-2" />
                            Experience & Qualifications
                        </h2>
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h3 className="font-medium text-gray-800">Education</h3>
                                <p className="text-gray-600">{doctor?.qualification}</p>
                            </div>
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h3 className="font-medium text-gray-800">Experience</h3>
                                <p className="text-gray-600">{doctor?.experience} years of clinical experience</p>
                            </div>
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h3 className="font-medium text-gray-800">Languages</h3>
                                <p className="text-gray-600">English, Hindi</p>
                            </div>
                        </div>
                    </div>

                    {/* Hospital Info */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hospital Information</h2>
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 mb-4 md:mb-0">
                                    <img
                                        src={hospital?.image}
                                        alt={hospital?.name}
                                        className="w-full h-auto rounded-lg object-cover"
                                        style={{ maxHeight: '150px' }}
                                    />
                                </div>
                                <div className="md:w-2/3 md:pl-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">{hospital?.name}</h3>
                                    <p className="text-gray-600 mb-3">{hospital?.address}, {hospital?.city}, {hospital?.state}</p>
                                    <div className="flex items-center mb-4">
                                        <Star className="h-5 w-5 text-yellow-500 mr-1" />
                                        <span className="font-semibold text-gray-800">{hospital?.rating}</span>
                                        <span className="text-gray-600 text-sm ml-1">({Math.floor(Math.random() * 200) + 50} reviews)</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {hospital?.facilities.slice(0, 4).map((facility, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full"
                                            >
                                                {facility}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">Book Appointment</h2>
                            <p className="text-gray-600">Consultation Fee: ₹{doctor?.consultationFee}</p>
                        </div>

                        {isBookingConfirmed ? (
                            <div className="text-center py-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Booking Confirmed!</h3>
                                <p className="text-gray-600 mb-4">Redirecting to payment page...</p>
                            </div>
                        ) : (
                            <>
                                {/* Date Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Select Date
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {doctor?.availableSlots?.map((slot) => (
                                            <button
                                                key={slot.date}
                                                className={`py-2 px-3 rounded-md text-sm font-medium ${selectedDate === slot.date
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    } transition`}
                                                onClick={() => {
                                                    setSelectedDate(slot.date);
                                                    setSelectedSlot('');
                                                }}
                                            >
                                                {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Slot Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        Select Time Slot
                                    </label>
                                    {selectedDate ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {availableSlots?.map((slot) => (
                                                <button
                                                    key={slot}
                                                    className={`py-2 px-3 rounded-md text-sm font-medium ${selectedSlot === slot
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        } transition`}
                                                    onClick={() => setSelectedSlot(slot)}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">Please select a date first</p>
                                    )}
                                </div>

                                {/* Payment Info */}
                                <div className="bg-gray-50 p-4 rounded-md mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Consultation Fee</span>
                                        <span className="font-medium text-gray-800">₹{doctor?.consultationFee}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                        <span>Booking Fee</span>
                                        <span>₹0</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2 flex justify-between items-center font-medium">
                                        <span>Total</span>
                                        <span className="text-lg text-gray-800">₹{doctor?.consultationFee}</span>
                                    </div>
                                </div>

                                {/* Book Button */}
                                <button
                                    onClick={handleBooking}
                                    disabled={!selectedDate || !selectedSlot || !"currentUser"}
                                    className={`w-full py-3 rounded-md font-medium flex items-center justify-center ${!selectedDate || !selectedSlot || !"currentUser"
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        } transition`}
                                >
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    {currentUser ? 'Confirm Appointment' : 'Login to Book'}
                                </button>

                                {!currentUser && (
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        Please login to book an appointment
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </Layout>

    );
};

export default DoctorDetailPage;