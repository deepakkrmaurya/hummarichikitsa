import React, { useEffect, useState } from 'react'
import { Calendar, CreditCard, MapPin, Clock, Frown, PlusCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAppointment } from '../Redux/appointment';
import { getAllDoctors } from '../Redux/doctorSlice';
import { getAllHospital } from '../Redux/hospitalSlice';
import avatar from '../../src/assets/logo-def.png';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import socket from '../Helper/socket';

function Appointment() {
    const hospital = useSelector((state) => state.hospitals.hospitals);
    const appoint = useSelector((state) => state.appointment?.appointment);
    const dispatch = useDispatch();
    const doct = useSelector((state) => state?.doctors?.doctors.doctors);

    const isLoading = useSelector((state) => state.appointment?.loading);
    const [activeTab, setActiveTab] = useState('active');
    const [doctors, setdoctors] = useState([])
    const [appointments, setappointments] = useState([])
    useEffect(() => {
        setdoctors(doct)
    }, [doct])
    useEffect(() => {
        if (appoint) {
            setappointments(appoint);
        }
    }, [appoint]);
    useEffect(() => {
        socket.on("appointmentUpdate", (data) => {
            // console.log("👉 Live Update:", data);

            setappointments((prev) => {
                const exists = prev.some((a) => a._id === data._id);
                if (exists) {
                    return prev.map((a) => (a._id === data._id ? data : a));
                }
                return [...prev, data];
            });
        });

        socket.on("doctorUpdate", (data) => {
            setdoctors((prev) => {
                const exists = prev.some((a) => a._id === data._id);

                if (exists) {
                    return prev.map((a) => (a._id === data._id ? data : a));
                }
                return [...prev, data];
            });
        })

        socket.on("doctoractive", (data) => {
            setdoctors((prev) => {
                const exists = prev.some((a) => a._id === data._id);

                if (exists) {
                    return prev.map((a) => (a._id === data._id ? data : a));
                }
                return [...prev, data];
            });
        })

        return () => {
            socket.off("appointmentUpdate");
            socket.off("doctorUpdate");
            socket.off("doctoractive");
        };
    }, [dispatch]);
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
                <div className="flex justify-center items-center h-[100vh]">
                    <span class="Loader"></span>
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
                            const doctor = doctors?.find(d => d._id === appointment?.doctorId?._id);
                            const availability = appointment.doctorId.availability.filter((d) => d.date == appointment.date)
                            const hospitals = hospital.find(h => h._id === appointment?.hospitalId);
                            //   alert(appointment.status)
                            if (appointment.status === "completed") {
                                finalStatus = "Completed";
                            } else {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                const appointmentDate = new Date(appointment.date);
                                appointmentDate.setHours(0, 0, 0, 0);

                                finalStatus = appointmentDate >= today ? "Active" : "Completed";
                            }

                            return (
                                // <div
                                //     key={index}
                                //     className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                // >
                                //     <div className="p-6">

                                //         {/* ✅ Live Status Section (Top) */}
                                //         {finalStatus !== 'Completed' && doctor.active ? (
                                //             <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 mb-6 border border-green-100 shadow-sm">
                                //                 <div className="flex items-center justify-between">
                                //                     <div className="flex items-center space-x-3">
                                //                         <span className="relative flex h-3 w-3">
                                //                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                //                             <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                                //                         </span>
                                //                         <p className="text-sm font-medium text-gray-700">
                                //                             Current: <span className="text-green-700 font-bold">#{doctor?.currentAppointment}</span>
                                //                         </p>
                                //                     </div>
                                //                     <p className="text-sm font-medium text-gray-700">
                                //                         Your No: <span className="text-teal-700 font-bold">#{appointment?.appointmentNumber}</span>
                                //                     </p>
                                //                 </div>
                                //             </div>
                                //         ) : (
                                //             <p className="text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-lg py-4 px-6 shadow-sm">
                                //                 The doctor currently has no patients to view.
                                //             </p>
                                //         )}

                                //         {/* ✅ Header Section */}
                                //         <div className="flex items-start  pt-1 justify-between mb-6">
                                //             <div className="flex items-center space-x-4">
                                //                 <div className="relative">
                                //                     <img
                                //                         src={doctor?.photo || avatar}
                                //                         className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                                //                         alt={`${doctor?.name}'s profile`}
                                //                     />
                                //                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shadow">
                                //                         <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                //                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                //                         </svg>
                                //                     </div>
                                //                 </div>
                                //                 <div>
                                //                     <h3 className="font-bold text-gray-900 text-lg">{doctor?.name}</h3>
                                //                     <p className="text-sm text-gray-600">{doctor?.specialty}</p>
                                //                     <div className="mt-1 flex items-center text-sm text-gray-500">
                                //                         <svg className="w-4 h-4 mr-1 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                //                         </svg>
                                //                         <span>{hospitals?.name}</span>
                                //                     </div>
                                //                 </div>
                                //             </div>

                                //             <span
                                //                 className={`px-3 py-1.5 text-xs font-semibold rounded-full ${finalStatus === 'Active'
                                //                     ? 'bg-green-100 text-green-700'
                                //                     : finalStatus === 'Completed'
                                //                         ? 'bg-blue-100 text-blue-700'
                                //                         : 'bg-gray-100 text-gray-700'
                                //                     }`}
                                //             >
                                //                 {finalStatus}
                                //             </span>
                                //         </div>

                                //         {/* ✅ Appointment Details */}
                                //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                //             <div className="bg-gray-50 rounded-xl p-4 flex items-center">
                                //                 <div className="bg-blue-100 p-2.5 rounded-lg mr-3">
                                //                     <Calendar className="w-5 h-5 text-blue-600" />
                                //                 </div>
                                //                 <div>
                                //                     <p className="text-xs text-gray-500 font-medium">Appointment Date</p>
                                //                     <p className="font-semibold text-gray-900">{formatDate(appointment.date)}</p>
                                //                     <p className="font-semibold text-gray-900">{availability[0]?.display[0]}</p>
                                //                 </div>
                                //             </div>

                                //             <div className="bg-gray-50 rounded-xl p-4 flex items-center">
                                //                 <div className="bg-blue-100 p-2.5 rounded-lg mr-3">
                                //                     <CreditCard className="w-5 h-5 text-blue-600" />
                                //                 </div>
                                //                 <div>
                                //                     <p className="text-xs text-gray-500 font-medium">Payment</p>
                                //                     <p className="font-semibold text-gray-900">
                                //                         ₹{appointment.booking_amount} • {appointment.paymentMethod}
                                //                     </p>
                                //                 </div>
                                //             </div>

                                //             <div className="bg-gray-50 rounded-xl p-4 flex items-center">
                                //                 <div className="bg-blue-100 p-2.5 rounded-lg mr-3">
                                //                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                //                     </svg>
                                //                 </div>
                                //                 <div>
                                //                     <p className="text-xs text-gray-500 font-medium">Token No</p>
                                //                     <p className="font-semibold text-gray-900">{appointment?.token}</p>
                                //                 </div>
                                //             </div>
                                //         </div>

                                //         {/* ✅ Action Button */}
                                //         <div className="flex justify-center">
                                //             <Link
                                //                 to={`/appointment_details_page/${appointment?._id}`}
                                //                 className="w-full bg-[#009689] text-white text-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]">
                                //                 View Full Details
                                //             </Link>
                                //         </div>
                                //     </div>
                                // </div>
                                <div
                                    key={index}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="p-6 sm:p-8">

                                        {/* 🟢 Live Status */}
                                        {finalStatus !== "Completed" && doctor.active ? (
                                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-6 border border-emerald-100 flex justify-between items-center shadow-sm">
                                                <div className="flex items-center space-x-3">
                                                    <span className="relative flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                                                    </span>
                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-medium text-gray-800">Currently Serving:</span>{" "}
                                                        <span className="text-emerald-700 font-semibold">
                                                            #{doctor?.currentAppointment}
                                                        </span>
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium text-gray-800">Your Turn:</span>{" "}
                                                    <span className="text-teal-700 font-semibold">
                                                        #{appointment?.appointmentNumber}
                                                    </span>
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg">
                                                <div className="text-center ">
                                                    <div className="">
                                                     
                                                        {/* <p className="text-amber-700 text-lg font-medium leading-relaxed">
                                                            The doctor is currently unavailable for a short time.
                                                        </p> */}
                                                        <p className="text-amber-600 text-base leading-relaxed">
                                                            Please wait — your consultation will resume once the doctor is active again.
                                                        </p>
                                                         <p className="text-amber-600 text-sm  font-medium">
                                                            Waiting for doctor to come online...
                                                        </p>
                                                    </div>

                                                    
                                                </div>
                                            </div>

                                        )}

                                        {/* 👨‍⚕️ Doctor Info */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <img
                                                        src={doctor?.photo || avatar}
                                                        alt={`${doctor?.name}`}
                                                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                                                    />
                                                    {doctor.active && (
                                                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{doctor?.name}</h3>
                                                    <p className="text-sm text-gray-600">{doctor?.specialty}</p>
                                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                                        <svg
                                                            className="w-4 h-4 mr-1 text-teal-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                        </svg>
                                                        <span>{hospitals?.name}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <span
                                                className={`mt-4 sm:mt-0 px-4 py-1.5 text-xs font-semibold rounded-full tracking-wide ${finalStatus === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : finalStatus === "Completed"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {finalStatus}
                                            </span>
                                        </div>

                                        {/* 📅 Appointment Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3 border border-gray-100">
                                                <div className="bg-blue-100 p-2.5 rounded-lg">
                                                    <Calendar className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Appointment Date</p>
                                                    <p className="text-gray-900 font-semibold">{formatDate(appointment.date)}</p>
                                                    <p className="text-gray-600 text-sm">{availability[0]?.display[0]}</p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3 border border-gray-100">
                                                <div className="bg-blue-100 p-2.5 rounded-lg">
                                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Payment</p>
                                                    <p className="text-gray-900 font-semibold">
                                                        ₹{appointment.booking_amount} • {appointment.paymentMethod}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3 border border-gray-100">
                                                <div className="bg-blue-100 p-2.5 rounded-lg">
                                                    <svg
                                                        className="w-5 h-5 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Token No</p>
                                                    <p className="font-semibold text-gray-900">{appointment?.token}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 🔗 Action Button */}
                                        <div className="flex justify-center">
                                            <Link
                                                to={`/appointment_details_page/${appointment?._id}`}
                                                className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-center py-3 px-8 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                            >
                                                View Full Details
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