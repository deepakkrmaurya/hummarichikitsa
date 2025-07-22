import { useState, useEffect } from 'react';
import { AppointmentCancelled, AppointmentConferm, getAppointmentById } from '../Redux/appointment';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Calendar, Clock, User, Phone, MapPin, Hospital, BriefcaseMedical } from 'lucide-react';


const AppointmentDetailsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [appointment, setAppointments] = useState(null);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getAppointment = async () => {
        const res = await dispatch(getAppointmentById(id));
        setAppointments(res.payload);
        setIsLoading(false);
    };

    const ConfirmAppointment = async (appointment_id) => {
        await dispatch(AppointmentConferm(appointment_id));
        getAppointment();
    };

    const CancelledAppointment = async (appointment_id) => {
        await dispatch(AppointmentCancelled(appointment_id));
        getAppointment();
    };

    useEffect(() => {
        getAppointment();
    }, []);

    

    const statusColors = {
        confirmed: 'bg-emerald-100 text-emerald-800',
        pending: 'bg-amber-100 text-amber-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Appointments
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">Appointment Details</h1>
                                <div className="flex items-center mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[appointment?.status]}`}>
                                        {appointment?.status.charAt(0).toUpperCase() + appointment?.status.slice(1)}
                                    </span>
                                    <span className="ml-3 text-blue-100 text-sm">ID: {appointment?._id?.slice(-8).toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="bg-white/10 p-3 rounded-lg">
                                <Calendar className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    {/* Appointment Overview */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-600">Date</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-800">
                                    {formatDate(appointment?.date)}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-600">Time Slot</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-800">{appointment?.slot}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-600">Fees Paid</span>
                                </div>
                                <p className="text-lg font-semibold text-emerald-600">₹{appointment?.amount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Details Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                        {/* Patient Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Patient Information</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium">{appointment?.patient}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Mobile</p>
                                        <p className="font-medium">{appointment?.mobile}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date of Birth</p>
                                        <p className="font-medium">{appointment?.dob || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Doctor Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <BriefcaseMedical className="h-5 w-5 text-emerald-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Doctor Information</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">Dr. {appointment?.doctorId?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Specialization</p>
                                        <p className="font-medium">{appointment?.doctorId?.specialty}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Experience</p>
                                        <p className="font-medium">{appointment?.doctorId?.experience || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hospital Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow lg:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <Hospital className="h-5 w-5 text-purple-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Hospital Information</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{appointment?.hospitalId?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="font-medium">{appointment?.hospitalId?.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Contact</p>
                                        <p className="font-medium">{appointment?.hospitalId?.phone || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex flex-wrap justify-center gap-4">
                            {appointment?.status === 'pending' && (
                                <button 
                                    onClick={() => ConfirmAppointment(appointment?._id)}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    <CheckCircle className="h-5 w-5" />
                                    Confirm Appointment
                                </button>
                            )}

                            {appointment?.status !== 'cancelled' && (
                                <button 
                                    onClick={() => CancelledAppointment(appointment?._id)}
                                    className="px-6 py-3 bg-white border border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    <XCircle className="h-5 w-5" />
                                    Cancel Appointment
                                </button>
                            )}

                            <button 
                                onClick={() => navigate(`/doctors/${appointment?.doctorId?._id}`)}
                                className="px-6 py-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Book Follow-up
                            </button>
                        </div>
                    </div>
                </div>

                {/* Important Notes Section */}
                <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Important Notes
                    </h2>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>Please arrive 15 minutes before your scheduled appointment time</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>Bring your ID and any relevant medical records</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>Face masks are required in all clinical areas</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>Cancellations require 24 hours notice to avoid fees</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailsPage;