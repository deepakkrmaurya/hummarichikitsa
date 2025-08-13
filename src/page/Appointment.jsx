import React, { useEffect } from 'react'
import { Calendar, CreditCard, MapPin, Clock } from 'lucide-react';
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
    
    useEffect(() => {
        (async () => {
            await dispatch(getAllAppointment())
            await dispatch(getAllDoctors())
            await dispatch(getAllHospital())
        })()
    }, [])

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

    return (
        <Layout>
            <div className="space-y-4">
            {appointments?.map((appointment, index) => {
                const doctor = doctors.find(d => d._id === appointment.doctorId);
                const hospitals = hospital.find(h => h._id === appointment.hospitalId);

                return (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md">
                        <div className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="relative">
                                    <img
                                        src={avatar}
                                        className="w-16 h-16 rounded-lg object-cover border-2 border-blue-50"
                                        alt={`${doctor?.name}'s profile`}
                                    />
                                    {appointment.status === 'confirmed' && (
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start space-x-2">
                                        <div className="truncate">
                                            <h3 className="font-semibold text-gray-900 text-lg truncate">{doctor?.name}</h3>
                                            <p className="text-sm text-gray-600 truncate">{doctor?.specialty}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            appointment.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
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
                                {/* {appointment.status === 'confirmed' && (
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                        Cancel Appointment
                                    </button>
                                )} */}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        </Layout>
    )
}

export default Appointment