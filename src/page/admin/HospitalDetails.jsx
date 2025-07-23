import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHospital, FaPhone, FaEnvelope, FaGlobe, FaStar,
    FaMapMarkerAlt, FaEdit, FaUserMd, FaProcedures, FaBed,
    FaSearch, FaPlus, FaCalendarAlt, FaChartLine
} from 'react-icons/fa';
import Dashboard from '../../components/Layout/Dashboard';
import axiosInstance from '../../Helper/axiosInstance';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteDoctor } from '../../Redux/doctorSlice';
import { GetHospitalById } from '../../Redux/hospitalSlice';
import { toast } from 'react-hot-toast';
import { GetStaff, StaffDelete } from '../../Redux/staffSlice';

const HospitalDetails = () => {
    const navigate = useNavigate();
    const [hospital, setHospital] = useState(null);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [doctor, setDoctor] = useState([]);
    const [staff, setStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Professional healthcare color scheme
    const colors = {
        primary: '#2563eb',      // Vibrant blue
        secondary: '#3b82f6',    // Light blue
        accent: '#10b981',       // Emerald green
        danger: '#ef4444',       // Red
        warning: '#f59e0b',      // Amber
        background: '#f8fafc',   // Lightest gray
        card: '#ffffff',         // White
        text: '#1e293b',         // Dark slate
        muted: '#64748b'         // Slate
    };

    const getHospitalById = async () => {
        try {
            const res = await dispatch(GetHospitalById(id));
            setHospital(res?.payload);
        } catch (error) {
            console.error("Error fetching hospital:", error);
            toast.error("Failed to load hospital data");
        }
    };
    const getstaff = async () => {
        try {
            const res = await dispatch(GetStaff())
            const data = res?.payload
            setStaff(data?.staff)

        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error("Failed to load doctors");
        }
    };

    const deleteStaffId = async (id) => {
        try {
            const res = await dispatch(StaffDelete(id));
            if (res?.payload?.success) {
                getstaff()
            }
        } catch (error) {
            console.error("Error fetching hospital:", error);
            toast.error("Failed to load hospital data");
        }
    };

    const getDoctors = async () => {
        try {
            const res = await axiosInstance.get(`/doctor/?hospitalId=${id}`);
            setDoctor(res.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error("Failed to load doctors");
        }
    };

    const deleteDoctorHandler = async (doctorId) => {
        try {
            await dispatch(deleteDoctor(doctorId));
            getDoctors();
            toast.success("Doctor deleted successfully");
        } catch (error) {
            toast.error("Failed to delete doctor");
        }
    };

    useEffect(() => {
        getstaff()
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await getHospitalById();
                await getDoctors();
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Filter doctors based on search term
    const filteredDoctors = doctor.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredStaff = staff.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const statusBadgeVariants = {
        active: { backgroundColor: colors.accent },
        deactive: { backgroundColor: colors.danger }
    };

    if (isLoading) {
        return (
            <Dashboard>
                <div className="flex justify-center items-center h-screen">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="rounded-full h-16 w-16 border-t-4 border-b-4"
                        style={{ borderColor: colors.primary }}
                    />
                </div>
            </Dashboard>
        );
    }

    if (!hospital) {
        return (
            <Dashboard>
                <div className="flex flex-col items-center justify-center h-screen p-6">
                    <div className="bg-red-100 p-4 rounded-full mb-4">
                        <FaHospital className="text-red-500 text-4xl" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Hospital Not Found</h2>
                    <p className="text-center mb-6" style={{ color: colors.muted }}>
                        The hospital you're looking for doesn't exist or may have been removed
                    </p>
                    <button
                        onClick={() => navigate('/hospitals')}
                        className="px-6 py-2 rounded-lg font-medium transition-colors"
                        style={{
                            backgroundColor: colors.primary,
                            color: 'white',
                            ':hover': { backgroundColor: colors.secondary }
                        }}
                    >
                        Back to Hospitals
                    </button>
                </div>
            </Dashboard>
        );
    }

    return (
        <Dashboard>
            <motion.div
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="min-h-screen p-4 md:p-6"
                style={{ backgroundColor: colors.background }}
            >
                {/* Header Section */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-6 rounded-xl"
                    style={{
                        backgroundColor: '#2B6CB0',
                        backgroundImage: ''
                    }}
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Hospital Profile</h1>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            Detailed view and management of hospital information
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link to={`/hospital/update/${id}`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md transition-all"
                                style={{
                                    backgroundColor: colors.accent,
                                    color: 'white'
                                }}
                            >
                                <FaEdit /> Edit Profile
                            </motion.button>
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md transition-all"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                color: colors.primary
                            }}
                        >
                            Back to List
                        </motion.button>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Sidebar - Hospital Info */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full lg:w-1/3"
                    >
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            {/* Hospital Image */}
                            <div className="h-48 md:h-56 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                                {hospital?.image ? (
                                    <motion.img
                                        src={hospital.image}
                                        alt={hospital.name}
                                        className="h-full w-full object-cover"
                                        whileHover={{ scale: 1.02 }}
                                    />
                                ) : (
                                    <div className="p-8 rounded-lg flex items-center justify-center">
                                        <FaHospital className="text-6xl" style={{ color: colors.primary }} />
                                    </div>
                                )}
                            </div>

                            {/* Hospital Details */}
                            <div className="p-6">
                                <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: colors.text }}>
                                    {hospital.name}
                                </h2>
                                <div className="flex items-center gap-2 mb-4" style={{ color: colors.muted }}>
                                    <FaMapMarkerAlt style={{ color: colors.primary }} />
                                    <span>{hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}</span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
                                        <div className="p-2 rounded-full" style={{ backgroundColor: `${colors.primary}10` }}>
                                            <FaPhone style={{ color: colors.primary }} />
                                        </div>
                                        <span style={{ color: colors.text }}>{hospital.phone}</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
                                        <div className="p-2 rounded-full" style={{ backgroundColor: `${colors.primary}10` }}>
                                            <FaEnvelope style={{ color: colors.primary }} />
                                        </div>
                                        <span style={{ color: colors.text }}>{hospital.email}</span>
                                    </div>

                                    {hospital.website && (
                                        <a
                                            href={hospital.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                                            style={{ backgroundColor: `${colors.primary}05` }}
                                        >
                                            <div className="p-2 rounded-full" style={{ backgroundColor: `${colors.primary}10` }}>
                                                <FaGlobe style={{ color: colors.primary }} />
                                            </div>
                                            <span style={{ color: colors.primary }} className="hover:underline">
                                                {hospital.website.replace(/^https?:\/\//, '')}
                                            </span>
                                        </a>
                                    )}
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${colors.primary}05` }}>
                                        <div className="text-sm" style={{ color: colors.muted }}>Doctors</div>
                                        <div className="text-xl font-bold" style={{ color: colors.primary }}>{doctor.length}</div>
                                    </div>
                                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${colors.accent}05` }}>
                                        <div className="text-sm" style={{ color: colors.muted }}>Staff</div>
                                        <div className="text-xl font-bold" style={{ color: colors.accent }}>{staff.length}</div>
                                    </div>
                                </div>

                                {/* Specialties */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>Specialties</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {hospital.specialties.map((specialty, index) => (
                                            <motion.span
                                                key={index}
                                                className="px-3 py-1 rounded-full text-sm"
                                                style={{
                                                    backgroundColor: `${colors.primary}10`,
                                                    color: colors.primary
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {specialty}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Tabs */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full lg:w-2/3"
                    >
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            {/* Tabs Navigation */}
                            <div className="flex overflow-x-auto">
                                {[
                                    { id: 'overview', icon: <FaHospital className="mr-2" />, label: 'Overview' },
                                    { id: 'doctors', icon: <FaUserMd className="mr-2" />, label: 'Doctors' },
                                    { id: 'staff', icon: <FaUserMd className="mr-2" />, label: 'Staff' },
                                    { id: 'facilities', icon: <FaProcedures className="mr-2" />, label: 'Facilities' },
                                    { id: 'appointments', icon: <FaCalendarAlt className="mr-2" />, label: 'Appointments' },

                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ?
                                            `border-${colors.primary} text-${colors.primary}` :
                                            'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {activeTab === 'overview' && (
                                            <div>
                                                <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Hospital Overview</h3>
                                                <div className="prose max-w-none" style={{ color: colors.text }}>
                                                    <p className="mb-4">Welcome to the comprehensive overview of {hospital.name}. This hospital is a leading healthcare provider in the region, offering top-notch medical services across various specialties.</p>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                        <div className="p-4 rounded-lg border" style={{ borderColor: `${colors.muted}20` }}>
                                                            <h4 className="font-bold mb-2" style={{ color: colors.primary }}>Key Features</h4>
                                                            <ul className="space-y-2">
                                                                {hospital.facilities.slice(0, 5).map((facility, index) => (
                                                                    <li key={index} className="flex items-start">
                                                                        <span className="inline-block w-2 h-2 rounded-full mt-2 mr-2" style={{ backgroundColor: colors.accent }}></span>
                                                                        <span>{facility}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="p-4 rounded-lg border" style={{ borderColor: `${colors.muted}20` }}>
                                                            <h4 className="font-bold mb-2" style={{ color: colors.primary }}>Medical Team</h4>
                                                            <p>Our hospital boasts a team of {doctor.length} highly qualified doctors across various specialties.</p>
                                                            <div className="mt-3">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={() => setActiveTab('doctors')}
                                                                    className="text-sm px-4 py-2 rounded-lg"
                                                                    style={{
                                                                        backgroundColor: `${colors.primary}10`,
                                                                        color: colors.primary
                                                                    }}
                                                                >
                                                                    View All Doctors
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'doctors' && (
                                            <div>
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                                    <h3 className="text-xl font-bold" style={{ color: colors.text }}>Medical Team</h3>
                                                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                                        <div className="relative w-full md:w-64">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <FaSearch style={{ color: colors.muted }} />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder="Search doctors..."
                                                                className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full"
                                                                style={{
                                                                    borderColor: colors.muted,
                                                                    ':focus': { borderColor: colors.primary }
                                                                }}
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                            />
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => navigate(`/doctor/create/${hospital._id}`)}
                                                            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2"
                                                            style={{
                                                                backgroundColor: colors.primary,
                                                                color: 'white'
                                                            }}
                                                        >
                                                            <FaPlus /> Add Doctor
                                                        </motion.button>
                                                    </div>
                                                </div>

                                                {/* Doctors Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {filteredDoctors.length > 0 ? (
                                                        filteredDoctors.map((doc) => (
                                                            <motion.div
                                                                key={doc._id}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                                                                style={{
                                                                    borderColor: `${colors.muted}20`,
                                                                    backgroundColor: colors.card
                                                                }}
                                                                whileHover={{ y: -5 }}
                                                            >
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                                                                        <img
                                                                            className="h-full w-full object-cover"
                                                                            src={doc.photo || 'https://via.placeholder.com/40'}
                                                                            alt={doc.name}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium" style={{ color: colors.text }}>{doc.name}</h4>
                                                                        <p className="text-xs" style={{ color: colors.muted }}>{doc.specialty}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 mb-3">
                                                                    <div>
                                                                        <p className="text-xs" style={{ color: colors.muted }}>Experience</p>
                                                                        <p className="text-sm" style={{ color: colors.text }}>{doc.experience} years</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs" style={{ color: colors.muted }}>Fee</p>
                                                                        <p className="text-sm" style={{ color: colors.text }}>₹{doc.consultationFee}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <div className="flex items-center">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <svg
                                                                                key={i}
                                                                                className={`w-4 h-4 ${i < Math.floor(doc.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                            </svg>
                                                                        ))}
                                                                        <span className="ml-1 text-xs" style={{ color: colors.muted }}>{doc.rating}</span>
                                                                    </div>
                                                                    <motion.span
                                                                        className="px-2 py-0.5 text-xs rounded-full text-white"
                                                                        animate={doc.status}
                                                                        variants={statusBadgeVariants}
                                                                    >
                                                                        {doc.status}
                                                                    </motion.span>
                                                                </div>
                                                                <div className="flex justify-end gap-2">
                                                                    <Link to={`/doctor/${doc._id}`}>
                                                                        <motion.button
                                                                            whileHover={{ scale: 1.1 }}
                                                                            whileTap={{ scale: 0.9 }}
                                                                            className="text-sm px-3 py-1 rounded"
                                                                            style={{
                                                                                backgroundColor: `${colors.primary}10`,
                                                                                color: colors.primary
                                                                            }}
                                                                        >
                                                                            View
                                                                        </motion.button>
                                                                    </Link>
                                                                    <Link to={`/doctor/update/${doc._id}`}>
                                                                        <motion.button
                                                                            whileHover={{ scale: 1.1 }}
                                                                            whileTap={{ scale: 0.9 }}
                                                                            className="text-sm px-3 py-1 rounded"
                                                                            style={{
                                                                                backgroundColor: `${colors.accent}10`,
                                                                                color: colors.accent
                                                                            }}
                                                                        >
                                                                            Edit
                                                                        </motion.button>
                                                                    </Link>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => deleteDoctorHandler(doc._id)}
                                                                        className="text-sm px-3 py-1 rounded"
                                                                        style={{
                                                                            backgroundColor: `${colors.danger}10`,
                                                                            color: colors.danger
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </motion.button>
                                                                </div>
                                                            </motion.div>
                                                        ))
                                                    ) : (
                                                        <div className="col-span-full p-8 text-center">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.primary}10` }}>
                                                                    <FaUserMd className="text-2xl" style={{ color: colors.primary }} />
                                                                </div>
                                                                <h3 className="text-lg font-medium mb-1" style={{ color: colors.text }}>
                                                                    No doctors found
                                                                </h3>
                                                                <p className="text-sm" style={{ color: colors.muted }}>
                                                                    {searchTerm ? 'Try a different search term' : 'No doctors registered in this hospital'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {activeTab === 'staff' && (
                                            <div>
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                                    <h3 className="text-xl font-bold" style={{ color: colors.text }}>Medical Team</h3>
                                                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                                        <div className="relative w-full md:w-64">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <FaSearch style={{ color: colors.muted }} />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder="Search staff..."
                                                                className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full"
                                                                style={{
                                                                    borderColor: colors.muted,
                                                                    ':focus': { borderColor: colors.primary }
                                                                }}
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                            />
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => navigate(`/staff/register/${hospital._id}`)}
                                                            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2"
                                                            style={{
                                                                backgroundColor: colors.primary,
                                                                color: 'white'
                                                            }}
                                                        >
                                                            <FaPlus /> Add Staff
                                                        </motion.button>
                                                    </div>
                                                </div>

                                                {/* Doctors Grid */}
                                                <div className="overflow-x-scroll rounded-lg border shadow-sm" style={{
                                                    borderColor: `${colors.muted}20`,
                                                    backgroundColor: colors.card
                                                }}>
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>
                                                                    Staff Member
                                                                </th>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>
                                                                    Contact Info
                                                                </th>
                                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {filteredStaff.length > 0 ? (
                                                                filteredStaff.map((doc) => (
                                                                    <motion.tr
                                                                        key={doc._id}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="flex items-center">
                                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                                    <img
                                                                                        className="h-10 w-10 rounded-full object-cover"
                                                                                        src={doc.photo || 'https://via.placeholder.com/40'}
                                                                                        alt={doc.name}
                                                                                    />
                                                                                </div>
                                                                                <div className="ml-4">
                                                                                    <div className="text-sm font-medium" style={{ color: colors.text }}>{doc.name}</div>
                                                                                    <div className="text-xs" style={{ color: colors.muted }}>{doc.role || 'Staff'}</div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <div className="text-sm" style={{ color: colors.text }}>{doc.email}</div>
                                                                            <div className="text-xs" style={{ color: colors.muted }}>+91-{doc.number}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                            <div className="flex justify-end space-x-2">
                                                                                {/* <Link to={`/doctor/${doc._id}`}>
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.05 }}
                                                                                        whileTap={{ scale: 0.95 }}
                                                                                        className="inline-flex items-center px-3 py-1 rounded-md text-sm"
                                                                                        style={{
                                                                                            backgroundColor: `${colors.primary}10`,
                                                                                            color: colors.primary
                                                                                        }}
                                                                                    >
                                                                                        View
                                                                                    </motion.button>
                                                                                </Link> */}
                                                                                {/* <Link to={`/doctor/update/${doc._id}`}>
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.05 }}
                                                                                        whileTap={{ scale: 0.95 }}
                                                                                        className="inline-flex items-center px-3 py-1 rounded-md text-sm"
                                                                                        style={{
                                                                                            backgroundColor: `${colors.accent}10`,
                                                                                            color: colors.accent
                                                                                        }}
                                                                                    >
                                                                                        Edit
                                                                                    </motion.button>
                                                                                </Link> */}
                                                                                <motion.button
                                                                                    whileHover={{ scale: 1.05 }}
                                                                                    whileTap={{ scale: 0.95 }}
                                                                                    onClick={() => {
                                                                                        if (window.confirm('Are you sure you want to delete this staff member?')) {
                                                                                            deleteStaffId(doc._id);
                                                                                        }
                                                                                    }}
                                                                                    className="inline-flex items-center px-3 py-1 rounded-md text-sm"
                                                                                    style={{
                                                                                        backgroundColor: `${colors.danger}10`,
                                                                                        color: colors.danger
                                                                                    }}
                                                                                >
                                                                                    Delete
                                                                                </motion.button>
                                                                            </div>
                                                                        </td>
                                                                    </motion.tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="3" className="px-6 py-12 text-center">
                                                                        <div className="flex flex-col items-center justify-center">
                                                                            <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.primary}10` }}>
                                                                                <FaUserMd className="text-2xl" style={{ color: colors.primary }} />
                                                                            </div>
                                                                            <h3 className="text-lg font-medium mb-1" style={{ color: colors.text }}>
                                                                                No staff members found
                                                                            </h3>
                                                                            <p className="text-sm" style={{ color: colors.muted }}>
                                                                                {searchTerm ? 'Try a different search term' : 'No staff registered in this hospital'}
                                                                            </p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'facilities' && (
                                            <div>
                                                <h3 className="text-xl font-bold mb-6" style={{ color: colors.text }}>Hospital Facilities</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {hospital.facilities.map((facility, index) => (
                                                        <motion.div
                                                            key={index}
                                                            className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                                                            style={{
                                                                borderColor: `${colors.muted}20`,
                                                                backgroundColor: colors.card
                                                            }}
                                                            whileHover={{ scale: 1.02 }}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                                                                    <FaProcedures style={{ color: colors.primary }} />
                                                                </div>
                                                                <span className="font-medium" style={{ color: colors.text }}>{facility}</span>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'appointments' && (
                                            <div>
                                                <h3 className="text-xl font-bold mb-6" style={{ color: colors.text }}>Appointments</h3>
                                                <div className="bg-gray-50 p-8 rounded-lg text-center">
                                                    <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: `${colors.primary}10` }}>
                                                        <FaCalendarAlt className="text-2xl" style={{ color: colors.primary }} />
                                                    </div>
                                                    <h4 className="text-lg font-medium mb-2" style={{ color: colors.text }}>Appointment Management</h4>
                                                    <p className="text-sm mb-4" style={{ color: colors.muted }}>
                                                        View and manage all hospital appointments in one place
                                                    </p>
                                                    <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.primary, color: 'white' }}>
                                                        View Appointments
                                                    </button>
                                                </div>
                                            </div>
                                        )}


                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </Dashboard>
    );
};

export default HospitalDetails;