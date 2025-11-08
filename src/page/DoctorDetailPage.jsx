import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react';
import { User, Smartphone } from 'lucide-react';
import { isSameDay, isBefore, addDays } from 'date-fns';
import { Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Star, Clock, Calendar, CreditCard, CheckCircle, Award, BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHospital } from '../Redux/hospitalSlice';
import { getAllDoctors } from '../Redux/doctorSlice';
import { useEffect, useState } from 'react';
import { AppointmentCreate } from '../Redux/appointment';
import Layout from '../components/Layout/Layout';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Payment from './Payment';
import { useRef } from 'react';
import axiosInstance from '../Helper/axiosInstance';

const DoctorDetailPage = () => {
    const today = new Date().toISOString().split('T')[0];

    // Tomorrow's Date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

    const [selectDate, setSelectDate] = useState();

    // Check which button is selected
    const isTodaySelected = selectDate === today;
    const isTomorrowSelected = selectDate === tomorrowFormatted;
    const dispatch = useDispatch();
    const currentUser = JSON.parse(localStorage.getItem('data')) || null;
    const isLoggdIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            return new Date(year, month, day);
        });
    };
    // Redux state
    const hospitals = useSelector((state) => state.hospitals.hospitals);
    const { doctors, loading: doctorsLoading } = useSelector((state) => state.doctors.doctors);
    const { loading: hospitalsLoading } = useSelector((state) => state.hospitals);

    // Find doctor and hospital data
    const doctor = doctors?.find(d => d?._id === doctorId);
    const hospital = doctor ? hospitals.find(h => h?._id === doctor?.hospitalId?._id) : null;

    // Local state
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [errormessage, setErrorMessage] = useState();
    const [patient, setPatient] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [Loading, setLoading] = useState(false);

    // Helper function to check if date is today or in the past
    const isDisabledDate = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const slotDate = new Date(dateString);
        return isBefore(slotDate, today) || isSameDay(slotDate, today);
    };

    // Set first available future date as default on load
    useEffect(() => {
        if (doctor?.availableSlots) {
            const futureSlot = doctor.availableSlots.find(slot => !isDisabledDate(slot.date));
            if (futureSlot) {
                setSelectedDate(futureSlot.date);
            }
        }
    }, [doctor]);

    // Format experience text
    const formatExperience = (years) => {
        return years === 1 ? `${years} year` : `${years} years`;
    };

    // Format rating display
    const formatRating = (rating) => {
        return rating % 1 === 0 ? rating.toFixed(1) : rating;
    };

    // Generate random reviews count (for demo)
    const getRandomReviews = () => {
        return Math.floor(Math.random() * 200) + 50;
    };

    // Available slots for selected date
    const availableSlots = doctor?.availableSlots.find(as => as.date === selectedDate)?.slots || [];

    // Handle booking submission
    const handleBooking = async () => {
        if (!isLoggdIn) {
            toast.error('Please log in to book an appointment');
            navigate('/login');
            return;
        }

        if (!selectDate) {
            setErrorMessage('Please select a date')
            return
        }



        // if (!selectedDate || !selectedSlot) {
        //     toast.error('Please select a date and time slot');
        //     return;
        // }

        if (!patient) {
            toast.error('Patient name is required');
            return;
        }

        if (!mobile || mobile.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }
        if (!selectDate) {
            // toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        const newAppointment = {
            patient,
            mobile,
            dob,
            patientId: currentUser?._id,
            doctorId: doctor?._id,
            hospitalId: hospital?._id,
            // date: selectedDate,
            date: selectDate,
            // slot: selectedSlot,
            amount: doctor?.consultationFee,
            booking_amount: doctor?.consultationFee,
            createdAt: new Date().toISOString()
        };

        const res = await dispatch(AppointmentCreate(newAppointment));

        if (res?.payload?.success) {
          
            // Patient ka mobile number (country code ke sath, e.g. 91 for India)
            const mobileNumber = 91 + res?.payload.savedAppointment.mobile; // e.g. "919876543210"
            
            // Message banate hain
            const message = `
Hello ${res?.payload.savedAppointment.patient},
📅 *Appointment Details*
───────────────────────
🧾 Token No: ${res?.payload.savedAppointment.token}
📋 Serial No: ${res?.payload.savedAppointment.appointmentNumber}
📱 Mobile No: ${res?.payload.savedAppointment.mobile}
📅 Date: ${res?.payload.savedAppointment.date}
✅ Please reach on time.
`;
            // //  👨‍⚕️ Doctor: ${"doctor?.name"}
            //  🏥 Hospital: ${"hospital?.name"}

            // Encode karna zaruri hai warna space/emoji break karenge
            const encodedMessage = encodeURIComponent(message);

            // WhatsApp URL
            const whatsappURL = `https://wa.me/${mobileNumber}?text=${encodedMessage}`;

            // Auto redirect / auto click
            window.open(whatsappURL, "_blank");


            setLoading(false)
            navigate(`/confirmation/${res.payload?.savedAppointment?._id}`);
            return;


            // const loadRazorpayScript = () => {
            //     return new Promise((resolve) => {
            //         if (window.Razorpay) {
            //             resolve(true);
            //             return;
            //         }

            //         const script = document.createElement('script');
            //         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            //         script.onload = () => {
            //             console.log('Razorpay SDK loaded successfully');
            //             resolve(true);
            //         };
            //         script.onerror = () => {
            //             console.error('Failed to load Razorpay SDK');
            //             resolve(false);
            //         };
            //         document.body.appendChild(script);
            //     });
            // };

            // const displayRazorpay = async () => {
            //     try {
            //         const res = await loadRazorpayScript();
            //         if (!res) {
            //             alert('Razorpay SDK failed to load. Are you online?');
            //             return;
            //         }

            //         const options = {
            //             key: 'rzp_test_jzJYbDuU9u8Jnh',
            //             amount: orderData.amount,
            //             currency: orderData.currency || 'INR',
            //             name: 'Appointment Booking',
            //             description: 'Service Appointment',
            //             order_id: orderData.orderId,
            //             handler: async function (response) {
            //                 try {
            //                     const result = await axiosInstance.post('/appointment/verify', {
            //                         razorpay_order_id: response.razorpay_order_id,
            //                         razorpay_payment_id: response.razorpay_payment_id,
            //                         razorpay_signature: response.razorpay_signature
            //                     });

            //                     const res = result.data;

            //                     if (res?.success) {
            //                         navigate(`/confirmation/${res?.appointment?._id}`);
            //                     } else {
            //                         alert('Payment verification failed');
            //                     }
            //                 } catch (error) {
            //                     console.error('Verification error:', error);
            //                     alert('Payment verification error. Please contact support.');
            //                 }
            //             },
            //             prefill: {
            //                 name: orderData.customerName || '',
            //                 email: orderData.customerEmail || '',
            //                 contact: orderData.customerPhone || ''
            //             },
            //             theme: {
            //                 color: '#3399c1'
            //             },
            //             modal: {
            //                 ondismiss: function () {
            //                     alert('Payment was not completed');
            //                     navigate('/');
            //                 }
            //             }
            //         };

            //         rzpInstanceRef.current = new window.Razorpay(options);
            //         rzpInstanceRef.current.open();

            //     } catch (error) {
            //         console.error('Payment processing error:', error);
            //         alert('Error processing payment. Please try again.');
            //         navigate('/');
            //     }
            // };

            // displayRazorpay();

            // return () => {
            //     if (rzpInstanceRef.current) {
            //         rzpInstanceRef.current.close();
            //     }
            // };
        }
        setLoading(false)
    };

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getAllHospital()),
                    dispatch(getAllDoctors())
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Doctor Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <BookOpen className="h-5 w-5 text-teal-600 mr-2" />
                                About
                            </h2>
                            <p className="text-gray-600">
                                {doctor?.bio || 'No biography available for this doctor.'}
                            </p>
                        </div>

                        {/* Experience & Qualifications */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Award className="h-5 w-5 text-teal-600 mr-2" />
                                Experience & Qualifications
                            </h2>
                            <div className="space-y-4">
                                <div className="border-l-4 border-teal-600 pl-4">
                                    <h3 className="font-medium text-gray-800">Education</h3>
                                    <p className="text-gray-600">{doctor?.qualification}</p>
                                </div>
                                <div className="border-l-4 border-teal-600 pl-4">
                                    <h3 className="font-medium text-gray-800">Experience</h3>
                                    <p className="text-gray-600">
                                        {formatExperience(doctor?.experience)} of clinical experience
                                    </p>
                                </div>
                                <div className="border-l-4 border-teal-600 pl-4">
                                    <h3 className="font-medium text-gray-800">Languages</h3>
                                    <p className="text-gray-600">English, Hindi</p>
                                </div>
                            </div>
                        </div>

                        {/* Hospital Info */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Hospital Information
                                </h2>
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
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                                            {hospital?.name}
                                        </h3>
                                        <p className="text-gray-600 mb-3">
                                            {hospital?.address}, {hospital?.city}, {hospital?.state}
                                        </p>
                                        <div className="flex items-center mb-4">
                                            <Star className="h-5 w-5 text-yellow-500 mr-1" />
                                            <span className="font-semibold text-gray-800">
                                                {formatRating(hospital?.rating)}
                                            </span>
                                            <span className="text-gray-600 text-sm ml-1">
                                                ({getRandomReviews()} reviews)
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {hospital?.facilities?.slice(0, 4).map((facility, index) => (
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
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 border border-gray-100">
                            <div className="border-b pb-4 mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                    Book Appointment
                                </h2>
                                <p className="text-gray-600">
                                    Consultation Fee: ₹{doctor?.consultationFee}
                                </p>
                            </div>

                            {/* Calendar Picker */}
                            <div className="mb-8">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Calendar className="h-4 w-4 text-teal-600" />
                                    <span>Choose Appointment Date</span>
                                </label>

                                <div className="bg-white rounded-lg border border-gray-100 shadow-[0px_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
                                    {/* Month Navigation */}
                                    {/* <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-50 to-teal-50/30">
                                        <button
                                            className="p-1.5 rounded-lg hover:bg-white/50 transition"
                                            onClick={() => {
                                                const prevMonth = new Date(currentMonth);
                                                prevMonth.setMonth(prevMonth.getMonth() - 1);
                                                setCurrentMonth(prevMonth);
                                            }}
                                        >
                                            <ChevronLeft className="h-5 w-5 text-teal-600" />
                                        </button>
                                        <h3 className="font-semibold text-teal-800">
                                            {currentMonth.toLocaleDateString('en-US', {
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </h3>
                                        <button
                                            className="p-1.5 rounded-lg hover:bg-white/50 transition"
                                            onClick={() => {
                                                const nextMonth = new Date(currentMonth);
                                                nextMonth.setMonth(nextMonth.getMonth() + 1);
                                                setCurrentMonth(nextMonth);
                                            }}
                                        >
                                            <ChevronRight className="h-5 w-5 text-teal-600" />
                                        </button>
                                    </div> */}

                                    {/* Day Headers */}
                                    {/* <div className="grid grid-cols-7 px-2 pt-2">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                            <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div> */}

                                    {/* Dates Grid */}
                                    {/* <div className="grid grid-cols-7 p-2">
                                        {getDaysInMonth(currentMonth).map((date) => {
                                            const day = date.getDate();
                                            const dateString = date.toISOString().split('T')[0];
                                            const slotData = doctor?.availableSlots?.find(s => s.date === dateString);
                                            const isSelected = selectedDate === dateString;
                                            const isToday = isSameDay(new Date(), date);
                                            const isDisabled = isDisabledDate(dateString) || !slotData;

                                            return (
                                                <button
                                                    key={dateString}
                                                    onClick={() => {
                                                        if (!isDisabled) {
                                                            setSelectedDate(dateString);
                                                            setSelectedSlot('');
                                                        }
                                                    }}
                                                    disabled={isDisabled}
                                                    className={`
            relative h-12 flex flex-col items-center justify-center
            transition-all duration-200
            ${isSelected
                                                            ? 'bg-teal-600 text-white rounded-xl'
                                                            : isDisabled
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'hover:bg-teal-50/50 rounded-lg'
                                                        }
            ${isToday && !isSelected && !isDisabled ? 'border border-teal-300' : ''}
          `}
                                                >
                                                    <span className={`
            text-sm font-medium
            ${isSelected ? 'text-white' :
                                                            isDisabled ? 'text-gray-400' :
                                                                isToday ? 'text-teal-600' : 'text-gray-700'}
          `}>
                                                        {day}
                                                    </span>

                                                    {slotData?.slots?.length > 0 && !isDisabled && (
                                                        <span className={`
              absolute bottom-2 w-1.5 h-1.5 rounded-full
              ${isSelected ? 'bg-white/90' : 'bg-teal-500'}
            `} />
                                                    )}

                                                    {isDisabled && (
                                                        <div className="absolute inset-0 bg-white bg-opacity-70 rounded-lg flex items-center justify-center">
                                                            <span className="text-xs text-gray-500">{day}</span>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div> */}

                                    {/* Selected Date Card */}
                                    {/* {selectedDate && (
                                        <div className="px-4 pb-3">
                                            <div className="bg-teal-50/70 rounded-lg p-3 flex items-center gap-2">
                                                <CalendarCheck className="h-4 w-4 text-teal-600" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {new Date(selectedDate).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="ml-auto text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                                                    {availableSlots.length} slots available
                                                </span>
                                            </div>
                                        </div>
                                    )} */}
                                    {/* <div>
                                        <button
                                            onClick={() => { setSelectDate(today); }}
                                            className={`flex justify-center items-center w-full p-3 rounded-lg text-white font-medium shadow-md transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 ${isTodaySelected ? 'bg-green-700 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                                                }`}
                                        >
                                            Today
                                        </button>

                                        <button
                                            onClick={() => { setSelectDate(tomorrowFormatted); }}
                                            className={`flex justify-center items-center w-full p-3 rounded-lg text-white font-medium shadow-md transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 mt-2 ${isTomorrowSelected ? 'bg-green-700 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                                                }`}
                                        >
                                            Tomorrow
                                        </button>
                                    </div> */}
                                    <div className="space-y-1">
                                        {/* Date Selection Buttons */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectDate(today)}
                                                // className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200  ${isTodaySelected
                                                //     ? 'bg-blue-600 text-white shadow-sm'
                                                //     : selectDate
                                                //         ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100'
                                                //         : 'bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-200'
                                                //     }`}
                                                className={`flex-1 p-3 rounded-lg font-medium shadow-md transition-all ${isTodaySelected
                                                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                    }`}
                                            >
                                                Today
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setSelectDate(tomorrowFormatted)}
                                                // className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${isTomorrowSelected
                                                //     ? 'bg-blue-600 text-white shadow-sm'
                                                //     : selectDate
                                                //         ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100'
                                                //         : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                                //     }`}
                                                className={`flex-1 p-3 rounded-lg font-medium shadow-md transition-all ${isTomorrowSelected
                                                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                    }`}
                                            >
                                                Tomorrow
                                            </button>
                                        </div>

                                        {/* Error Message */}
                                        {errormessage != null && (
                                            <div className="flex items-center text-red-500 text-xs py-2 ml-1">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3.5 w-3.5 mr-1"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <p className=' text-xl'>{errormessage}</p>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>

                            {/* Time Slot Selection */}
                            {/* <div className="mb-8">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Clock className="h-4 w-4 text-teal-600" />
                                    <span>Select Time Slot</span>
                                </label>

                                {selectedDate ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {availableSlots?.map((slot) => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`
                                                        relative p-3 rounded-xl border transition-all duration-200
                                                        ${selectedSlot === slot
                                                            ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                                                            : 'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50/30'
                                                        }
                                                    `}
                                                >
                                                    <span className="block text-sm font-medium">{slot}</span>

                                                    {selectedSlot === slot && (
                                                        <div className="absolute -top-2 -right-2">
                                                            <div className="bg-teal-700 text-white p-1 rounded-full">
                                                                <Check className="h-3 w-3" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        {selectedSlot && (
                                            <div className="mt-4 flex items-center justify-between bg-teal-50/50 rounded-lg px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-teal-600" />
                                                    <span className="text-sm font-medium text-gray-700">Selected Time</span>
                                                </div>
                                                <span className="text-sm font-semibold bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                                                    {selectedSlot}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                                        <Clock className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                                        <p className="text-sm text-gray-500">Please select a date first</p>
                                    </div>
                                )}
                            </div> */}

                            {/* Patient Information Form */}
                            <div className="space-y-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Patient Details</h3>

                                {/* Patient Name Field */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <User className="h-4 w-4 text-teal-600" />
                                        Patient Name
                                    </label>
                                    <input
                                        type="text"
                                        value={patient}
                                        onChange={(e) => setPatient(e.target.value)}
                                        placeholder="Enter full name"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all placeholder:text-gray-400"
                                        required
                                    />
                                </div>

                                {/* Mobile Number Field */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <Smartphone className="h-4 w-4 text-teal-600" />
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="text-gray-500">+91</span>
                                        </div>
                                        {/* <input
                                            type="tel"
                                            value={mobile}
                                            onChange={(e) => {
                                                setMobile(e.target.value)
                                                if (/^\d{0,10}$/.test(e.target.value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            placeholder="98765 43210"
                                            className="w-full pl-12 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all placeholder:text-gray-400"
                                            maxLength="10"
                                            pattern="[0-9]{10}"
                                            required

                                        /> */}
                                        <input
                                            type="tel"
                                            value={mobile}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d{0,10}$/.test(value)) {
                                                    setMobile(value);
                                                    handleChange(e);
                                                }
                                            }}
                                            placeholder="98765 43210"
                                            className="w-full pl-12 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all placeholder:text-gray-400"
                                            inputMode="numeric"    // mobile keyboard shows numbers only
                                            maxLength={10}
                                            required
                                        />

                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        We'll send appointment confirmation via WhatsApp
                                    </p>
                                </div>

                                {/* Date of Birth Field */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-teal-600" />
                                        Age
                                    </label>
                                    <input
                                        type="text"
                                        value={dob}

                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,3}$/.test(value)) {
                                                setDob(value);
                                                handleChange(e);
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Consultation Fee</span>
                                    <span className="font-medium text-gray-800">₹{doctor?.consultationFee}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                    <span>Booking Fee</span>
                                    <span>₹0</span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between items-center font-medium">
                                    <span>Total Payable</span>
                                    <span className="text-lg text-teal-800">₹{doctor?.consultationFee}</span>
                                </div>
                            </div>

                            {/* Book Button */}
                            {
                                Loading ? (<button

                                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition`}
                                >
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Wait....
                                </button>

                                ) : (
                                    <button
                                        onClick={() => {
                                            handleBooking()
                                            setLoading(true)
                                        }}
                                        // !selectedDate || !selectedSlot ||
                                        disabled={!patient || !mobile || mobile.length !== 10}
                                        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition
                                    ${!patient || !selectDate || !mobile || mobile.length !== 10
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600 shadow-md'
                                            }
                                `}
                                    >
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        {currentUser ? 'Confirm Appointment' : 'Login to Book'}
                                    </button>
                                )
                            }


                            {!currentUser && (
                                <p className="text-center text-sm text-gray-500 mt-2">
                                    Please login to book an appointment
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DoctorDetailPage;