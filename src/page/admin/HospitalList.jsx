import React, { useEffect, useState } from 'react';
import Dashboard from '../../components/Layout/Dashboard';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHospital } from '../../Redux/hospitalSlice';
import axiosInstance from '../../Helper/axiosInstance';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ChevronLeft, ChevronRight, Eye, Trash2, Filter } from 'lucide-react';
import hospital_img from '../../../src/assets/hospital_image.png';
const HospitalList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const hospitals = useSelector((state) => state?.hospitals?.hospitals);
    const itemsPerPage = 5;

    // Professional healthcare color scheme
    const colors = {
        primary: '#2B6CB0',      // Deep blue
        secondary: '#4299E1',    // Light blue
        accent: '#48BB78',       // Green
        danger: '#F56565',       // Red
        warning: '#ED8936',      // Orange
        background: '#F7FAFC',   // Light gray
        card: '#FFFFFF',         // White
        text: '#2D3748',         // Dark gray
        muted: '#718096'         // Gray
    };

    // Filter hospitals based on search and status
    const filteredHospitals = hospitals?.filter(hospital => {
        const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.city.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || hospital.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredHospitals?.length / itemsPerPage);
    const currentItems = filteredHospitals?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const updateStatus = async (id, status) => {
        const newStatus = status === 'active' ? 'deactive' : 'active';
        try {
            const res = await axiosInstance.put(`/hospital/${id}/status`, { status: newStatus });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(getAllHospital());
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axiosInstance.delete(`/hospital/${id}`);
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(getAllHospital());
            }
        } catch (error) {
            toast.error('Failed to delete hospital');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await dispatch(getAllHospital());
            } catch (error) {
                toast.error('Failed to load hospitals');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

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

    return (
        <Dashboard>
            <motion.div
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="p-6"
                style={{ backgroundColor: colors.background, minHeight: '100vh' }}
            >
                {/* Header Section */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 p-6 rounded-xl"
                    style={{ backgroundColor: colors.primary }}
                >
                    <div>
                        <h1 className="text-2xl font-bold text-white">Hospital Management</h1>
                        <p className="mt-2 text-sm" style={{ color: `${colors.card}90` }}>
                            A list of all registered hospitals including their details and status
                        </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to='/hospital/create'>
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm"
                                style={{
                                    backgroundColor: colors.accent,
                                    color: 'white'
                                }}
                            >
                                <Plus className="h-4 w-4" />
                                Add Hospital
                            </button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Filters Section */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-xl shadow-sm mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                Search
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4" style={{ color: colors.muted }} />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 rounded-md border focus:outline-none focus:ring-2 text-sm"
                                    style={{
                                        borderColor: colors.muted,
                                        focusRingColor: colors.primary
                                    }}
                                    placeholder="Search hospitals..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                Status
                            </label>
                            <select
                                className="block w-full pl-3 pr-10 py-2 rounded-md border focus:outline-none focus:ring-2 text-sm"
                                style={{
                                    borderColor: colors.muted,
                                    focusRingColor: colors.primary
                                }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="deactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-4 py-2 rounded-md border font-medium text-sm"
                                style={{
                                    borderColor: colors.primary,
                                    color: colors.primary
                                }}
                            >
                                <Filter className="h-4 w-4" />
                                Apply Filters
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Hospitals Table */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                    {isLoading ? (
                        <div className="p-12 flex justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="rounded-full h-12 w-12 border-t-2 border-b-2"
                                style={{ borderColor: colors.primary }}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>Hospital Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>Beds</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>Specialities</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <AnimatePresence>
                                            {currentItems?.length > 0 ? (
                                                currentItems.map((hospital, index) => (
                                                    <motion.tr
                                                        key={hospital._id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm" style={{ color: colors.text }}>
                                                            #HSP00{(currentPage - 1) * itemsPerPage + index + 1}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                                    <img
                                                                        className="h-full w-full object-cover"
                                                                        src={hospital.image || hospital_img}
                                                                        alt={hospital.name}
                                                                    />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium" style={{ color: colors.text }}>
                                                                        {hospital.name}
                                                                    </div>
                                                                    <div className="text-xs" style={{ color: colors.muted }}>
                                                                        {hospital.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="text-sm" style={{ color: colors.text }}>
                                                                {hospital.address}
                                                            </div>
                                                            <div className="text-xs" style={{ color: colors.muted }}>
                                                                {hospital.city}, {hospital.state}
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm" style={{ color: colors.text }}>
                                                            250
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {hospital.specialties?.slice(0, 3).map((specialty, i) => (
                                                                    <motion.span
                                                                        key={i}
                                                                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                                                        style={{
                                                                            backgroundColor: `${colors.primary}20`,
                                                                            color: colors.primary
                                                                        }}
                                                                    >
                                                                        {specialty}
                                                                    </motion.span>
                                                                ))}
                                                                {hospital.specialties?.length > 3 && (
                                                                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `${colors.muted}20`, color: colors.muted }}>
                                                                        +{hospital.specialties.length - 3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td
                                                            onClick={() => updateStatus(hospital._id, hospital.status)}
                                                            className="whitespace-nowrap px-6 py-4 text-sm cursor-pointer"
                                                        >
                                                            <motion.span
                                                                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
                                                                animate={hospital.status}
                                                                variants={statusBadgeVariants}
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                {hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                                                            </motion.span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end gap-4">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => navigate(`/hospital/${hospital._id}`)}
                                                                    className="flex items-center gap-1"
                                                                    style={{ color: colors.primary }}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    View
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => {
                                                                        if (window.confirm("Are you sure you want to delete this hospital?")) {
                                                                            handleDelete(hospital._id);
                                                                        }
                                                                    }}
                                                                    className="flex items-center gap-1"
                                                                    style={{ color: colors.danger }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    Delete
                                                                </motion.button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <motion.tr
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <td colSpan="7" className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.primary}10` }}>
                                                                <Search className="h-8 w-8" style={{ color: colors.primary }} />
                                                            </div>
                                                            <h3 className="text-lg font-medium mb-1" style={{ color: colors.text }}>
                                                                No hospitals found
                                                            </h3>
                                                            <p className="text-sm" style={{ color: colors.muted }}>
                                                                {searchTerm ? 'Try a different search term' : 'No hospitals registered yet'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md"
                                            style={{
                                                color: currentPage === 1 ? colors.muted : colors.text,
                                                backgroundColor: colors.card
                                            }}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md"
                                            style={{
                                                color: currentPage === totalPages ? colors.muted : colors.text,
                                                backgroundColor: colors.card
                                            }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm" style={{ color: colors.muted }}>
                                                Showing <span className="font-medium" style={{ color: colors.text }}>
                                                    {(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium" style={{ color: colors.text }}>
                                                    {Math.min(currentPage * itemsPerPage, filteredHospitals.length)}</span> of <span className="font-medium" style={{ color: colors.text }}>
                                                    {filteredHospitals.length}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium"
                                                    style={{
                                                        color: currentPage === 1 ? colors.muted : colors.text,
                                                        backgroundColor: colors.card,
                                                        borderColor: colors.muted
                                                    }}
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <ChevronLeft className="h-5 w-5" />
                                                </button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? 'z-10' : ''}`}
                                                        style={{
                                                            backgroundColor: currentPage === page ? colors.primary : colors.card,
                                                            color: currentPage === page ? 'white' : colors.text,
                                                            borderColor: colors.muted
                                                        }}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium"
                                                    style={{
                                                        color: currentPage === totalPages ? colors.muted : colors.text,
                                                        backgroundColor: colors.card,
                                                        borderColor: colors.muted
                                                    }}
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <ChevronRight className="h-5 w-5" />
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </motion.div>
        </Dashboard>
    );
};

export default HospitalList;