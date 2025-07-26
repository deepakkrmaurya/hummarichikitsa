import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHospital, FaPhone, FaEnvelope, FaGlobe, FaStar, FaPlus,
    FaMapMarkerAlt, FaEdit, FaSearch, FaUserMd, FaProcedures, FaBed
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import Dashboard from '../../components/Layout/Dashboard';
import axiosInstance from '../../Helper/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteDoctor } from '../../Redux/doctorSlice';
import { getStaffByHospitalId, StaffDelete } from '../../Redux/staffSlice';

const MyHospital = () => {

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
    const statusBadgeVariants = {
        active: { backgroundColor: colors.accent },
        deactive: { backgroundColor: colors.danger }
    };
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState([])
    const hospital = JSON.parse(localStorage.getItem('data')) || null;
    const dispatch = useDispatch();
    const deletedoctor = async (id) => {
        const res = await dispatch(deleteDoctor(id))
    }
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [staff, setStaff] = useState([]);
    const [stats, setStats] = useState({
        doctors: 0,
        appointments: 0,
        beds: 0
    });
    const filteredStaff = staff?.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredDoctors = doctor?.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
    const getstaff = async () => {
        try {
            "getStaffByHospitalId"
            const res = await dispatch(getStaffByHospitalId(hospital._id))
            const data = res?.payload
            setStaff(data)

        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error("Failed to load doctors");
        }
    };

    // Simulate loading animation for stats
    useEffect(() => {
        const timer = setTimeout(() => {
            setStats({
                doctors: 42,
                appointments: 18,
                beds: 56
            });
        }, 800);

        (
            async () => {
                getstaff()
                const res = axiosInstance.get(`/doctor/?hospitalId=${hospital._id}`)
                const doc = (await res).data
                setDoctor(doc)

            }
        )()

        return () => clearTimeout(timer);


    }, []);

    return (
        <Dashboard>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Header with animated edit button */}
                    <motion.div
                        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Hospital Management</h1>
                            <p className="text-gray-500">View and manage hospital profile</p>
                        </div>
                        <Link to={`/hospital/update/${hospital?._id}`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md transition-all"
                            >
                                <FaEdit /> Edit Profile
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Main Profile Card */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="md:flex">
                            {/* Image Section with animated rating */}
                            <div className="md:w-1/3 p-6  flex justify-center bg-gradient-to-br ">
                                <motion.div
                                    className="relative"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                >
                                    {/* <p>{hospital.image}</p> */}
                                    {hospital.image ? (
                                        <motion.img
                                            src={hospital.image}
                                            alt={hospital.name}
                                            className="w-full max-w-xs h-64 md:h-80 object-cover rounded-xl shadow-lg"
                                            whileHover={{ scale: 1.02 }}
                                        />
                                    ) : (
                                        <div className="w-64 h-64 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FaHospital className="text-blue-500 text-6xl" />
                                        </div>
                                    )}
                                    {/* <motion.div
                                        className="absolute -bottom-4 -right-4 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl shadow-lg"
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 3 }}
                                    >
                                        {hospital.rating.toFixed(1)}
                                    </motion.div> */}
                                </motion.div>
                            </div>

                            {/* Details Section */}
                            <div className="md:w-2/3 p-6 md:p-8">
                                <motion.div
                                    className="mb-6"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{hospital.name}</h2>
                                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                                        <FaMapMarkerAlt className="text-blue-500" />
                                        <span>{hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <motion.div
                                            className="flex items-center gap-2 text-gray-700 bg-blue-50 px-3 py-1.5 rounded-lg"
                                            whileHover={{ y: -2 }}
                                        >
                                            <FaPhone className="text-blue-500" />
                                            <span>{hospital.phone}</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center gap-2 text-gray-700 bg-blue-50 px-3 py-1.5 rounded-lg"
                                            whileHover={{ y: -2 }}
                                        >
                                            <FaEnvelope className="text-blue-500" />
                                            <span>{hospital.email}</span>
                                        </motion.div>
                                        {hospital.website && (
                                            <motion.a
                                                href={hospital.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"
                                                whileHover={{ y: -2 }}
                                            >
                                                <FaGlobe className="text-blue-500" />
                                                <span>{hospital.website.replace(/^https?:\/\//, '')}</span>
                                            </motion.a>
                                        )}
                                    </div>
                                </motion.div>


                            </div>
                        </div>
                        <motion.div>
                            {/* Tabs */}
                            <motion.div
                                className="mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="flex border-b border-gray-200">
                                    {['overview', 'facilities', 'reports', 'doctor', 'staff'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-2 font-medium text-sm capitalize ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Tab Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTab === 'overview' && (
                                        <div>
                                            {/* Specialties */}
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Specialties</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {hospital.specialties.map((specialty, index) => (
                                                        <motion.span
                                                            key={index}
                                                            className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm shadow-inner"
                                                            whileHover={{ scale: 1.05 }}
                                                        >
                                                            {specialty}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Facilities Preview */}
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Facilities</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {hospital.facilities.slice(0, 6).map((facility, index) => (
                                                        <motion.div
                                                            key={index}
                                                            className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                                                            whileHover={{ x: 5 }}
                                                        >
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            <span className="text-gray-700">{facility}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'facilities' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {hospital.facilities.map((facility, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <FaProcedures className="text-blue-500" />
                                                        </div>
                                                        <span className="font-medium">{facility}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'doctor' && (
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
                                            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: `${colors.muted}20`, backgroundColor: colors.card }}>
                                                {filteredDoctors.length > 0 ? (
                                                    <motion.table
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="w-full"
                                                    >
                                                        <thead>
                                                            <tr style={{ backgroundColor: `${colors.primary}05` }}>
                                                                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.primary }}>Doctor</th>
                                                                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.primary }}>Specialty</th>
                                                                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.primary }}>Experience</th>
                                                                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.primary }}>Fee</th>
                                                                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.primary }}>Rating</th>
                                                                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.primary }}>Status</th>
                                                                <th className="p-3 text-right text-sm font-medium" style={{ color: colors.primary }}>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredDoctors.map((doc) => (
                                                                <motion.tr
                                                                    key={doc._id}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="border-b hover:bg-opacity-10"
                                                                    style={{
                                                                        borderColor: `${colors.muted}10`,
                                                                        backgroundColor: doc._id % 2 === 0 ? `${colors.muted}03` : 'transparent'
                                                                    }}
                                                                    whileHover={{ backgroundColor: `${colors.primary}05` }}
                                                                >
                                                                    <td className="p-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                                                                <img
                                                                                    className="h-full w-full object-cover"
                                                                                    src={doc.photo || 'https://via.placeholder.com/40'}
                                                                                    alt={doc.name}
                                                                                />
                                                                            </div>
                                                                            <span style={{ color: colors.text }}>{doc.name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-3 text-sm" style={{ color: colors.muted }}>{doc.specialty}</td>
                                                                    <td className="p-3 text-sm" style={{ color: colors.text }}>{doc.experience} years</td>
                                                                    <td className="p-3 text-sm" style={{ color: colors.text }}>₹{doc.consultationFee}</td>
                                                                    <td className="p-3">
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
                                                                    </td>
                                                                    <td className="p-3">
                                                                        <motion.span
                                                                            className="px-2 py-1 text-xs rounded-full"
                                                                            animate={doc.status}
                                                                            variants={statusBadgeVariants}
                                                                            style={{
                                                                                color: 'white',
                                                                                display: 'inline-block',
                                                                                minWidth: '70px',
                                                                                textAlign: 'center'
                                                                            }}
                                                                        >
                                                                            {doc.status}
                                                                        </motion.span>
                                                                    </td>
                                                                    <td className="p-3">
                                                                        <div className="flex justify-end gap-2">
                                                                            <Link to={`/doctor/${doc._id}`}>
                                                                                <motion.button
                                                                                    whileHover={{ scale: 1.05 }}
                                                                                    whileTap={{ scale: 0.95 }}
                                                                                    className="text-sm px-3 py-1 rounded"
                                                                                    style={{
                                                                                        backgroundColor: `${colors.primary}10`,
                                                                                        color: colors.primary
                                                                                    }}
                                                                                >
                                                                                    View
                                                                                </motion.button>
                                                                            </Link>
                                                                            <Link to={`/update/doctor/${doc._id}`}>
                                                                            <motion.button
                                                                               
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
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
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                onClick={() => {
                                                                                    if (window.confirm('Are you sure you want to delete this doctor?')) {
                                                                                        deleteDoctorHandler(doc._id);
                                                                                    }
                                                                                }}
                                                                                className="text-sm px-3 py-1 rounded"
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
                                                            ))}
                                                        </tbody>
                                                    </motion.table>
                                                ) : (
                                                    <div className="p-8 text-center">
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
                                                        {filteredStaff?.length > 0 ? (
                                                            filteredStaff?.map((doc) => (
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
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>

                    {/* Stats Cards with loading animation */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: <FaUserMd className="text-xl" />, title: "Total Doctors", value: stats.doctors, color: "blue" },
            { icon: <FaProcedures className="text-xl" />, title: "Active Appointments", value: stats.appointments, color: "green" },
            { icon: <FaBed className="text-xl" />, title: "Available Beds", value: stats.beds, color: "orange" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium mb-1">{stat.title}</h3>
                  <p className={`text-3xl font-bold text-${stat.color}-600`}>
                    {stat.value > 0 ? stat.value : (
                      <span className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div> */}

                    {/* Recent Activity with staggered animation */}
                    {/* <motion.div 
          className="bg-white p-6 rounded-2xl shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: "New doctor joined", details: "Dr. Smith joined Cardiology department", time: "2 hours ago" },
              { action: "Appointment completed", details: "Patient #12345 with Dr. Johnson", time: "5 hours ago" },
              { action: "Facility maintenance", details: "MRI machine serviced", time: "1 day ago" }
            ].map((activity, index) => (
              <motion.div 
                key={index}
                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
                </div>



            </motion.div>
        </Dashboard>
    );
};

// Sample data



export default MyHospital