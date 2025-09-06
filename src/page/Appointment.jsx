import React, { useEffect, useState } from 'react'
import { Calendar, CreditCard, MapPin, Clock, Frown, PlusCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAppointment } from '../Redux/appointment';
import { getAllDoctors } from '../Redux/doctorSlice';
import { getAllHospital } from '../Redux/hospitalSlice';
import avatar from '../../src/assets/logo-def.png';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

function Appointment() {
    const hospital = useSelector((state) => state.hospitals.hospitals);
    const appointments = useSelector((state) => state.appointment?.appointment);
    const dispatch = useDispatch();
    const { doctors } = useSelector((state) => state?.doctors);
    const isLoading = useSelector((state) => state.appointment?.loading);
    const [activeTab, setActiveTab] = useState('active');

    useEffect(() => {
        (async () => {
            if (!doctors || doctors.length === 0) {
                await dispatch(getAllDoctors())
            }

            if (!hospital || hospital.length === 0) {
                await dispatch(getAllHospital())
            }
        })()
    }, [])

    useEffect(() => {
        if (!appointments || appointments.length === 0) {
            (async () => {
                await dispatch(getAllAppointment())
            })()
        }
    }, [])
  
    // Filter appointments based on tab selection
    const filteredAppointments = appointments?.filter(appointment => {
        if (activeTab === 'active') {
            // For active tab, show appointments that are not completed and not in the past
            if (appointment.status === "completed") return false;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const appointmentDate = new Date(appointment.date);
            appointmentDate.setHours(0, 0, 0, 0);
            
            return appointmentDate >= today;
        } else {
            // For completed tab, show completed appointments and past appointments
            if (appointment.status === "completed") return true;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const appointmentDate = new Date(appointment.date);
            appointmentDate.setHours(0, 0, 0, 0);
            
            return appointmentDate < today;
        }
    }) || [];

    // Function to format date with ordinal suffix
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const weekday = date.toLocaleString('default', { weekday: 'short' });

        // Add ordinal suffix
        let suffix = 'th';
        if (day % 10 === 1 && day !== 11) suffix = 'st';
        else if (day % 10 === 2 && day !== 12) suffix = 'nd';
        else if (day % 10 === 3 && day !== 13) suffix = 'rd';

        return `${weekday}, ${month} ${day}${suffix}`;
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                    
                    {/* Tab Navigation */}
                    <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'active' 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'completed' 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Completed
                        </button>
                    </div>
                    
                    <Link
                        to="/hospitals"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-150"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Book New Appointment
                    </Link>
                </div>

                {filteredAppointments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 p-12 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                            <Frown className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            {activeTab === 'active' ? 'No Active Appointments' : 'No Completed Appointments'}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            {activeTab === 'active' 
                                ? "You don't have any upcoming appointments" 
                                : "Your completed appointments will appear here"}
                        </p>
                        <div className="mt-6">
                            {activeTab === 'active' && (
                                <Link
                                    to="/hospitals"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                                    Book Appointment
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredAppointments.map((appointment, index) => {
                            let finalStatus;
                            const doctor = doctors.find(d => d._id === appointment?.doctorId);
                            const hospitals = hospital.find(h => h._id === appointment?.hospitalId);

                            if (appointment.status === "completed") {
                                finalStatus = "Completed";
                            } else {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                const appointmentDate = new Date(appointment.date);
                                appointmentDate.setHours(0, 0, 0, 0);

                                finalStatus = appointmentDate >= today ? "Active" : "Past";
                            }

                            return (
                                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md">
                                    <div className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="relative">
                                                <img
                                                    src={doctor?.photo || avatar}
                                                    className="w-16 h-16 rounded-lg object-cover border-2 border-blue-50"
                                                    alt={`${doctor?.name}'s profile`}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start space-x-2">
                                                    <div className="truncate">
                                                        <h3 className="font-semibold text-gray-900 text-lg truncate">{doctor?.name}</h3>
                                                        <p className="text-sm text-gray-600 truncate">{doctor?.specialty}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${finalStatus === 'Active' ? 'bg-green-100 text-green-800' :
                                                        finalStatus === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {finalStatus}
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex items-center text-sm text-gray-600">
                                                    <MapPin className="flex-shrink-0 w-4 h-4 text-blue-500" />
                                                    <span className="ml-2 truncate">{hospitals?.name}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
                                            <div className="flex items-start">
                                                <div className="bg-blue-50 p-2 rounded-lg">
                                                    <Calendar className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-xs text-gray-500">Appointment Date</p>
                                                    <p className="font-medium text-gray-900">{formatDate(appointment.date)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-blue-50 p-2 rounded-lg">
                                                    <Clock className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-xs text-gray-500">Time Slot</p>
                                                    <p className="font-medium text-gray-900">{appointment.slot}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-blue-50 p-2 rounded-lg">
                                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-xs text-gray-500">Payment</p>
                                                    <p className="font-medium text-gray-900">₹{appointment.booking_amount} • {appointment.paymentMethod}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-blue-50 p-2 rounded-lg">
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-xs text-gray-500">Token No</p>
                                                    <p className="font-medium text-gray-900">{appointment?.token}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-between items-center">
                                            <Link
                                                to={`/appointment_details_page/${appointment?._id}`}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Appointment