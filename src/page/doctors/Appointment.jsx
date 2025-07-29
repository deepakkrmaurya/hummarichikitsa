import { useState, useEffect } from 'react';
import { AppointmentCancelled, AppointmentConferm, getAppointmentById } from '../../Redux/appointment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaUserMd, FaHospital, FaCalendarAlt, FaClock, FaMoneyBillWave, FaPhone, FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';

const AppointmentDetails = () => {
    const { role } = useSelector((state) => state?.auth)
    const [isLoading, setIsLoading] = useState(true);
    const [appointment, setAppointments] = useState(null);
    const { id } = useParams();
    const dispatch = useDispatch();

    // Professional healthcare color palette
    const colors = {
        primary: '#3b82f6',       // Blue (trust, professionalism)
        secondary: '#60a5fa',     // Lighter blue
        accent: '#10b981',        // Green (health, success)
        background: '#f9fafb',    // Very light gray
        text: '#1f2937',          // Dark gray
        lightText: '#6b7280',     // Gray
        border: '#e5e7eb',        // Light border
        success: '#10b981',       // Green for success states
        warning: '#f59e0b',       // Orange for warnings
        error: '#ef4444',         // Red for errors
        cardBg: '#ffffff',        // White for cards
        inputBg: '#f3f4f6'       // Light gray for inputs
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
            <div className="flex justify-center items-center h-screen" style={{ backgroundColor: colors.background }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="h-16 w-16 rounded-full border-t-4 border-b-4"
                        style={{ borderColor: colors.primary }}
                    ></motion.div>
                    <p className="text-lg" style={{ color: colors.text }}>Loading appointment details...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.background }}>
            <div className="max-w-4xl mx-auto">
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden"
                        style={{
                            borderColor: colors.border,
                            backgroundColor: colors.cardBg
                        }}
                    >
                        {/* Header Section */}
                        <div
                            className="p-6 sm:p-8 text-white"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                            }}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h1 className="text-2xl sm:text-3xl font-bold">Appointment Summary</h1>
                                    <p className="opacity-90 mt-1">ID: {appointment?._id}</p>
                                </motion.div>
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${appointment?.status === 'confirmed'
                                        ? 'bg-green-500'
                                        : appointment?.status === 'cancelled'
                                            ? 'bg-red-500'
                                            : 'bg-amber-500'
                                        }`}
                                >
                                    {appointment?.status.charAt(0).toUpperCase() + appointment?.status.slice(1)}
                                </motion.span>
                            </div>
                        </div>

                        {/* Appointment Overview */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 sm:p-8 border-b"
                            style={{ borderColor: colors.border }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt style={{ color: colors.primary }} />
                                        <p className="text-sm font-medium" style={{ color: colors.lightText }}>Date</p>
                                    </div>
                                    <p className="text-lg font-semibold" style={{ color: colors.text }}>
                                        {new Date(appointment?.date).toLocaleDateString('en-IN', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <FaClock style={{ color: colors.primary }} />
                                        <p className="text-sm font-medium" style={{ color: colors.lightText }}>Time Slot</p>
                                    </div>
                                    <p className="text-lg font-semibold" style={{ color: colors.text }}>{appointment?.slot}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <FaMoneyBillWave style={{ color: colors.primary }} />
                                        <p className="text-sm font-medium" style={{ color: colors.lightText }}>Fees Paid</p>
                                    </div>
                                    <p className="text-lg font-semibold" style={{ color: colors.success }}>₹{appointment?.amount}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Details Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 sm:p-8">
                            {/* Patient Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="rounded-xl p-6 shadow-sm"
                                style={{
                                    borderColor: `${colors.primary}20`,
                                    backgroundColor: `${colors.primary}05`
                                }}
                            >
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
                                        <FaUser style={{ color: colors.primary }} />
                                    </div>
                                    <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Patient Details</h2>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Full Name', value: appointment?.patient, icon: <FaUser /> },
                                        { label: 'Mobile', value: appointment?.mobile, icon: <FaPhone /> },
                                        { label: 'DOB', value: appointment?.dob, icon: <FaCalendarAlt /> }
                                    ].map((item, index) => (
                                        <div key={index} className="flex gap-3">
                                            <div className="flex-shrink-0 mt-1" style={{ color: colors.primary }}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm" style={{ color: colors.lightText }}>{item?.label}</p>
                                                <p className="font-medium" style={{ color: colors.text }}>{item?.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Doctor Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="rounded-xl p-6 shadow-sm"
                                style={{
                                    borderColor: `${colors.accent}20`,
                                    backgroundColor: `${colors.accent}05`
                                }}
                            >
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.accent}20` }}>
                                        <FaUserMd style={{ color: colors.accent }} />
                                    </div>
                                    <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Doctor Details</h2>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Name', value: appointment?.doctorId?.name, icon: <FaUserMd /> },
                                        { label: 'Specialization', value: appointment?.doctorId?.specialty, icon: <FaUserMd /> },
                                        { label: 'Experience', value: appointment?.doctorId?.experience, icon: <FaCalendarAlt /> }
                                    ].map((item, index) => (
                                        <div key={index} className="flex gap-3">
                                            <div className="flex-shrink-0 mt-1" style={{ color: colors.accent }}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm" style={{ color: colors.lightText }}>{item?.label}</p>
                                                <p className="font-medium" style={{ color: colors.text }}>{item?.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Hospital Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="rounded-xl p-6 shadow-sm lg:col-span-2"
                                style={{
                                    borderColor: `${colors.secondary}20`,
                                    backgroundColor: `${colors.secondary}05`
                                }}
                            >
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.secondary}20` }}>
                                        <FaHospital style={{ color: colors.secondary }} />
                                    </div>
                                    <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Hospital Details</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Hospital Name', value: appointment?.hospitalId?.name, icon: <FaHospital /> },
                                        { label: 'Contact Number', value: appointment?.hospitalId?.phone, icon: <FaPhone /> },
                                        { label: 'Address', value: appointment?.hospitalId?.address, icon: <FaMapMarkerAlt />, colSpan: 'md:col-span-2' }
                                    ].map((item, index) => (
                                        <div key={index} className={`flex gap-3 ${item?.colSpan || ''}`}>
                                            <div className="flex-shrink-0 mt-1" style={{ color: colors.secondary }}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm" style={{ color: colors.lightText }}>{item?.label}</p>
                                                <p className="font-medium" style={{ color: colors.text }}>{item?.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AppointmentDetails;