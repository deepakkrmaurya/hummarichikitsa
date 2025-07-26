import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, FileText, BarChart, Settings, Search, Calendar as CalendarIcon, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
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
  const appointments = useSelector((state) => state.appointment?.appointment);

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

  const filteredAppointments = appointment?.filter(appointment =>
    appointment?.token?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      setIsLoading(true);
      try {
        await axiosInstance.patch('/appointment/hospital/patient');
        await getAppointment();
        await dispatch(getAllAppointment());
        await dispatch(getAllHospital());
        await dispatch(getAllDoctors());
      } catch (error) {
        console.error("Error in initial data loading:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
    confirmed: { backgroundColor: colors.accent },
    booked: { backgroundColor: colors.warning },
    cancelled: { backgroundColor: colors.danger },
    completed: { backgroundColor: colors.primary }
  };

  return (
    <Dashboard>
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        {activeTab === 'appointments' && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-6 p-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
                style={{ borderLeft: `4px solid ${colors.primary}` }}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: `${colors.primary}20` }}>
                    <CalendarIcon className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.muted }}>Today's Appointments</p>
                    <p className="text-2xl font-semibold mt-1" style={{ color: colors.text }}>
                      {isLoading ? (
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        appointments?.length
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
                style={{ borderLeft: `4px solid ${colors.accent}` }}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: `${colors.accent}20` }}>
                    <CheckCircle className="h-6 w-6" style={{ color: colors.accent }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.muted }}>Confirmed</p>
                    <p className="text-2xl font-semibold mt-1" style={{ color: colors.text }}>
                      {isLoading ? (
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <div>
                          {appointments?.filter(a => a.status === 'completed').length}
                        </div>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
                style={{ borderLeft: `4px solid ${colors.warning}` }}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: `${colors.warning}20` }}>
                    <ClockIcon className="h-6 w-6" style={{ color: colors.warning }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.muted }}>Pending</p>
                    <p className="text-2xl font-semibold mt-1" style={{ color: colors.text }}>
                      {isLoading ? (
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        appointments?.filter(a => a.status === 'pending').length
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Appointments List */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Today's Appointments</h2>
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4" style={{ color: colors.muted }} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
                    style={{ borderColor: colors.muted }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>
                          Patient
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>
                          Token
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>
                          Payment
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {filteredAppointments?.length > 0 ? (
                          filteredAppointments.map((appointment, index) => (
                            <motion.tr
                              key={appointment._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                                    <User className="h-5 w-5" style={{ color: colors.primary }} />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium" style={{ color: colors.text }}>
                                      {appointment.patient?.name || `Patient ${index + 1}`}
                                    </div>
                                    <div className="text-sm" style={{ color: colors.muted }}>
                                      ID: {appointment._id.substring(0, 8)}...
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium" style={{ color: colors.text }}>{appointment?.slot}</div>
                                <div className="text-sm" style={{ color: colors.muted }}>{appointment?.date}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">

                                <div className="text-sm" style={{ color: colors.muted }}>{appointment?.token}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <motion.span
                                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment?.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800'
                                    : appointment?.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : appointment?.status === 'cancelled'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: { type: 'spring', stiffness: 300 }
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {appointment?.status.charAt(0).toUpperCase() + appointment?.status.slice(1)}
                                </motion.span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment?.paymentStatus === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {appointment?.paymentStatus.charAt(0).toUpperCase() + appointment?.paymentStatus.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link to={`/appointment/${appointment?._id}`}>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-3 py-1 rounded-lg mr-2"
                                    style={{
                                      backgroundColor: `${colors.primary}20`,
                                      color: colors.primary
                                    }}
                                  >
                                    View
                                  </motion.button>
                                </Link>
                                {
                                  appointment.status !== 'completed' && (
                                    <motion.button
                                      onClick={() => {
                                        if (window.confirm("Are you sure you want to mark this appointment as completed?")) {
                                          ConfirmAppointment(appointment?._id);
                                        }
                                      }}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="px-3 py-1 rounded-lg mr-2"
                                      style={{
                                        backgroundColor: `${colors.primary}20`,
                                        color: colors.primary
                                      }}
                                    >
                                      Complete
                                    </motion.button>
                                  )
                                }
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td colSpan="5" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <FileText className="h-12 w-12 mb-4" style={{ color: colors.muted }} />
                                <h3 className="text-lg font-medium mb-1" style={{ color: colors.text }}>
                                  No appointments found
                                </h3>
                                <p className="text-sm" style={{ color: colors.muted }}>
                                  {searchTerm ? 'Try a different search term' : 'No appointments scheduled for today'}
                                </p>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab !== 'appointments' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto my-8"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
              <Settings className="h-10 w-10" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Feature
            </h2>
            <p className="text-gray-600 mb-6">
              This feature is currently under development and will be available soon.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('appointments')}
              className="px-6 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: colors.primary,
                color: 'white'
              }}
            >
              Back to Appointments
            </motion.button>
          </motion.div>
        )}
      </div>
    </Dashboard>
  );
};

export default DoctorDashboard;