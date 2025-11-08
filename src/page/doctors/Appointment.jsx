import { useState, useEffect } from 'react';
import { getAppointmentById } from '../../Redux/appointment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaUserMd, FaCalendarAlt, FaClock, FaMoneyBillWave, FaPhone, FaFileAlt, FaHospital, FaDownload } from 'react-icons/fa';
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io';
import Dashboard from '../../components/Layout/Dashboard';

const AppointmentDetails = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [appointment, setAppointments] = useState(null);
    const { id } = useParams();
    const dispatch = useDispatch();

    const colors = {
        primary: '#4f46e5',       // Vibrant indigo
        secondary: '#10b981',     // Emerald green
        accent: '#f59e0b',        // Amber
        background: '#f8fafc',    // Light background
        text: '#1e293b',          // Dark text
        lightText: '#64748b',     // Gray text
        border: '#e2e8f0',        // Light border
        success: '#10b981',       // Success green
        error: '#ef4444',         // Error red
        cardBg: '#ffffff'         // White cards
    };

    const getAppointment = async () => {
        const res = await dispatch(getAppointmentById(id));
        setAppointments(res.payload);
        setIsLoading(false);
    };

    useEffect(() => {
        getAppointment();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gray-50 py-1 px-4 ">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className=" mx-auto"
            >
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200">
                    <div className="bg-blue-600 p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold">Appointment Details</h1>
                                <p className="text-indigo-100 mt-1 text-sm">Token No: {appointment?.token}</p>
                            </div>
                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                appointment?.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {appointment?.status === 'confirmed' ? (
                                    <IoMdCheckmarkCircle className="mr-1 text-lg" />
                                ) : (
                                    <IoMdCloseCircle className="mr-1 text-lg" />
                                )}
                                {appointment?.status.charAt(0).toUpperCase() + appointment?.status.slice(1)}
                            </div>
                        </div>
                    </div>

                    {/* Appointment Summary */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-4 p-3 bg-indigo-50 rounded-lg">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FaCalendarAlt className="text-indigo-600 text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Appointment Date</p>
                                <p className="font-medium text-gray-900">{formatDate(appointment?.date)}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-3 bg-indigo-50 rounded-lg">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FaClock className="text-indigo-600 text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Time Slot</p>
                                <p className="font-medium text-gray-900">{appointment?.slot}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-3 bg-indigo-50 rounded-lg">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FaMoneyBillWave className="text-indigo-600 text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Amount Paid</p>
                                <p className="font-medium text-green-600">₹{appointment?.booking_amount}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-3 bg-indigo-50 rounded-lg">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FaFileAlt className="text-indigo-600 text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment Method</p>
                                <p className="font-medium text-gray-900">{appointment?.paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient, Doctor, and Hospital Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Patient Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                    >
                        <div className="bg-indigo-50 p-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-800 flex items-center">
                                <FaUser className="text-indigo-600 mr-2" />
                                Patient Information
                            </h2>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Full Name</p>
                                <p className="font-medium">{appointment?.patient}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Contact Number</p>
                                <p className="font-medium">{appointment?.mobile}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Doctor Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                    >
                        <div className="bg-green-50 p-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-800 flex items-center">
                                <FaUserMd className="text-green-600 mr-2" />
                                Doctor Information
                            </h2>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Doctor Name</p>
                                <p className="font-medium">{appointment?.doctorId?.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Specialization</p>
                                <p className="font-medium">{appointment?.doctorId?.specialty}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hospital Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                    >
                        <div className="bg-amber-50 p-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-800 flex items-center">
                                <FaHospital className="text-amber-600 mr-2" />
                                Hospital Information
                            </h2>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Hospital Name</p>
                                <p className="font-medium">{appointment?.hospitalId?.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Contact Number</p>
                                <p className="font-medium">{appointment?.hospitalId?.phone}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons - Now with consistent styling */}
                {/* <div className="flex justify-end space-x-4">
                    {appointment?.status === 'confirmed' && (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center px-6 py-2 rounded-lg font-medium border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
                        >
                            Cancel Appointment
                        </motion.button>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center px-6 py-2 rounded-lg font-medium border border-indigo-500 text-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                        <FaDownload className="mr-2" />
                        Download Receipt
                    </motion.button>
                </div> */}
            </motion.div>
        </div>
        </Dashboard>
    );
};

export default AppointmentDetails;