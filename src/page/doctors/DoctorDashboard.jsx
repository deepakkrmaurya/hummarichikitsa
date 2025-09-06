import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, FileText, Search, CheckCircle, XCircle, ChevronRight, Filter, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppointmentConferm, getAllAppointment, todayAppointment } from '../../Redux/appointment';
import { getAllHospital } from '../../Redux/hospitalSlice';
import { getAllDoctors } from '../../Redux/doctorSlice';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../../components/Layout/Dashboard';
import axiosInstance from '../../Helper/axiosInstance';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const [appointment, setAppointment] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const appointments = useSelector((state) => state.appointment?.appointment);

  // Professional healthcare color scheme
  const colors = {
    primary: '#2563EB',      // Refined blue
    secondary: '#0EA5E9',    // Bright blue
    accent: '#10B981',       // Calming green
    danger: '#EF4444',       // Alert red
    warning: '#F59E0B',      // Attention orange
    background: '#F8FAFC',   // Very light blue-gray
    card: '#FFFFFF',         // White
    text: '#1E293B',         // Dark blue-gray
    muted: '#64748B',        // Medium gray
    border: '#E2E8F0'        // Light border
  };

  const filteredAppointments = appointment?.filter(appointment => {
    const matchesSearch = 
      appointment?.token?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment?.mobile?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && appointment.status !== 'completed') ||
      (filterStatus === 'completed' && appointment.status === 'completed') ||
      (filterStatus === 'pending' && appointment.status === 'pending');
    
    return matchesSearch && matchesFilter;
  });

  const getAppointment = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(todayAppointment());
      setAppointment(res.payload.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const ConfirmAppointment = async (appointment_id) => {
    await dispatch(AppointmentConferm(appointment_id));
    getAppointment();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axiosInstance.patch('/appointment/hospital/patient');
        getAppointment();
        dispatch(getAllAppointment());
        dispatch(getAllHospital());
        dispatch(getAllDoctors());
      } catch (error) {
        console.error("Error in initial data loading:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!appointment || appointment.length === 0) {
      fetchData();
      getAppointment();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const statusConfig = {
    active: { 
      text: 'Active', 
      bgColor: '#D1FAE5', 
      textColor: '#065F46',
      icon: <Clock size={14} />
    },
    completed: { 
      text: 'Completed', 
      bgColor: '#DBEAFE', 
      textColor: '#1E40AF',
      icon: <CheckCircle size={14} />
    },
    pending: { 
      text: 'Pending', 
      bgColor: '#FEF3C7', 
      textColor: '#92400E',
      icon: <Clock size={14} />
    },
    cancelled: { 
      text: 'Cancelled', 
      bgColor: '#FEE2E2', 
      textColor: '#991B1B',
      icon: <XCircle size={14} />
    }
  };

  const getStatus = (appointment) => {
    if (appointment.status === "completed") return "completed";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);
    
    return appointmentDate >= today ? "active" : "cancelled";
  };

  const stats = [
    {
      title: 'Total Appointments',
      value: appointments?.length || 0,
      icon: <Calendar size={20} />,
      color: colors.primary,
      change: '+12%'
    },
    {
      title: 'Confirmed',
      value: appointments?.filter(a => a.status === 'completed').length || 0,
      icon: <CheckCircle size={20} />,
      color: colors.accent,
      change: '+5%'
    },
    {
      title: 'Pending',
      value: appointments?.filter(a => a.status === 'pending').length || 0,
      icon: <Clock size={20} />,
      color: colors.warning,
      change: '-2%'
    }
  ];

  return (
    <Dashboard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your appointments and patient schedule</p>
          </div>

          {/* Stats Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4"
                style={{ borderLeftColor: stat.color }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {isLoading ? (
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="text-xs mt-1" style={{ color: stat.color }}>
                      {stat.change}
                    </p>
                  </div>
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Appointments Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
                  >
                    <Filter size={16} />
                    Filter
                    {filterStatus !== 'all' && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        {filterStatus}
                      </span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                      >
                        <div className="py-1">
                          {['all', 'active', 'pending', 'completed'].map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                setFilterStatus(status);
                                setShowFilters(false);
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                filterStatus === status 
                                  ? 'bg-blue-50 text-blue-700' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Appointments Table */}
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="overflow-auto rounded-xl max-h-96">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Token
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {filteredAppointments?.length > 0 ? (
                          filteredAppointments.map((appointment, index) => {
                            const status = getStatus(appointment);
                            const statusStyle = statusConfig[status];
                            
                            return (
                              <motion.tr
                                key={appointment._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {appointment.patient || `Patient ${index + 1}`}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        ID: {appointment._id.substring(0, 8)}...
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{appointment?.slot}</div>
                                  <div className="text-sm text-gray-500">{appointment?.date}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-mono">{appointment?.token}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div 
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    style={{ 
                                      backgroundColor: statusStyle.bgColor,
                                      color: statusStyle.textColor
                                    }}
                                  >
                                    {statusStyle.icon}
                                    <span className="ml-1">{statusStyle.text}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    appointment?.paymentStatus === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {appointment?.paymentStatus?.charAt(0).toUpperCase() + appointment?.paymentStatus?.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end space-x-2">
                                    <Link to={`/appointment/${appointment?._id}`}>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                                      >
                                        View
                                      </motion.button>
                                    </Link>
                                    
                                    {appointment.status !== 'completed' && (
                                      <motion.button
                                        onClick={() => {
                                          if (window.confirm("Are you sure you want to mark this appointment as completed?")) {
                                            ConfirmAppointment(appointment?._id);
                                          }
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                      >
                                        Complete
                                      </motion.button>
                                    )}
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })
                        ) : (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td colSpan="6" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <FileText className="h-12 w-12 mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                  No appointments found
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {searchTerm || filterStatus !== 'all' 
                                    ? 'Try adjusting your search or filter criteria' 
                                    : 'No appointments scheduled for today'}
                                </p>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Dashboard>
  );
};

export default DoctorDashboard;