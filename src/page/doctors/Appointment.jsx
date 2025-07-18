import { useState, useEffect } from 'react';
import { getAppointmentById } from '../../Redux/appointment';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const AppointmentDetails = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [appointment, setAppointments] = useState()
    
    const { id } = useParams();
    const dispatch = useDispatch()
    const getAppointment = async () => {
        const res = await dispatch(getAppointmentById(id));
        console.log(res.payload)
        setAppointments(res.payload)
    }

    useEffect(() => {
        getAppointment()
        const timer = setTimeout(() => {
            setIsLoading(false);
            setShowDetails(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 bg-blue-100 rounded-full"></div>
                    <div className="h-4 bg-blue-100 rounded w-48"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Main Card */}
                <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-700 ease-out ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>

                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8 text-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">Appointment Summary</h1>
                                <p className="text-blue-100 mt-1">ID: {appointment?._id}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${appointment?.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'
                                } shadow-md`}>
                                {appointment?.status.charAt(0).toUpperCase() + appointment?.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Appointment Overview */}
                    <div className="p-6 sm:p-8 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500 font-medium">Date</p>
                                <p className="text-lg font-semibold">
                                    {new Date(appointment?.date).toLocaleDateString('en-IN', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500 font-medium">Time Slot</p>
                                <p className="text-lg font-semibold">{appointment?.slot}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500 font-medium">Fees Paid</p>
                                <p className="text-lg font-semibold text-green-600">₹{appointment?.amount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Details Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8">

                        {/* Patient Details */}
                        <div className="bg-blue-50 rounded-xl p-6 transition-all duration-500 delay-100 ease-in-out">
                            <div className="flex items-center gap-4 mb-5">                      
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Patient Details</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Full Name', value: appointment?.patientId?.name },
                                    { label: 'Email', value: appointment?.patientId?.email },
                                    { label: 'Phone', value: appointment?.patientId?.mobile }
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">{item?.label}</p>
                                            <p className="font-medium">{item?.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Doctor Details */}
                        <div className="bg-green-50 rounded-xl p-6 transition-all duration-500 delay-200 ease-in-out">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Doctor Details</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Name', value: appointment?.doctorId?.name },
                                    { label: 'Specialization', value: appointment?.doctorId?.specialty },
                                    { label: 'Experience', value: appointment?.doctorId?.experience }
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">{item?.label}</p>
                                            <p className="font-medium">{item?.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hospital Details */}
                        <div className="bg-purple-50 rounded-xl p-6 transition-all duration-500 delay-300 ease-in-out lg:col-span-2">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Hospital Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: 'Hospital Name', value: appointment?.hospitalId?.name },
                                    { label: 'Contact Number', value: appointment?.hospitalId?.phone },
                                    { label: 'Address', value: appointment?.hospitalId?.address, colSpan: 'md:col-span-2' }
                                ].map((item, index) => (
                                    <div key={index} className={`flex gap-3 ${item?.colSpan || ''}`}>
                                        <div className="flex-shrink-0">
                                            <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center">
                                                <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">{item?.label}</p>
                                            <p className="font-medium">{item?.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 sm:p-8 border-t border-gray-100 bg-gray-50">
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.02] flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Confirm Appointment
                            </button>
                            <button className="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all transform hover:scale-[1.02] flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Reschedule
                            </button>
                            <button className="px-6 py-3 border border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all transform hover:scale-[1.02] flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetails;