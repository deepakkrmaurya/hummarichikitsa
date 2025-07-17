import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHospital, FaPhone, FaEnvelope, FaGlobe, FaStar,
    FaMapMarkerAlt, FaEdit, FaUserMd, FaProcedures, FaBed
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import Dashboard from '../../components/Layout/Dashboard';
import axiosInstance from '../../Helper/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteDoctor } from '../../Redux/doctorSlice';

const MyHospital = () => {
    const navigate = useNavigate();
    const hospital = JSON.parse(localStorage.getItem('data')) || null;
    const dispatch = useDispatch();
    const deletedoctor = async(id)=>{
         const res = await dispatch(deleteDoctor(id))
    }
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        doctors: 0,
        appointments: 0,
        beds: 0
    });
    const [doctor, setDoctor] = useState([])
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
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md transition-all"
                        >
                            <FaEdit /> Edit Profile
                        </motion.button>
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

                                {/* Tabs */}
                                <motion.div
                                    className="mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="flex border-b border-gray-200">
                                        {['overview', 'doctor', 'facilities', 'reports'].map((tab) => (
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
                                            <div className="">
                                                {/* {hospital.facilities.map((facility, index) => (
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
                      ))} */}
                                                <div className=" py-0">
                                                    <div className="mx-auto">
                                                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                                            {/* Table Header */}
                                                            <div className="bg-blue-600 px-1 py-2 flex justify-between items-center">
                                                                <p className=" font-bold text-white">Doctors Directory</p>
                                                                <div className="flex space-x-2">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search doctors..."
                                                                        className="px-4 py-2 rounded-lg text-sm focus:outline-none"
                                                                    />
                                                                    <button
                                                                        onClick={() => navigate(`/doctor/create/${hospital._id}`)}
                                                                        className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition duration-200">
                                                                        Add New Doctor
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Table */}
                                                            <div className="overflow-x-auto">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                Doctor
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                Specialty
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                Experience
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                Rating
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                Fee
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                Status
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                Actions
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                                        {doctor.map((doctor) => (
                                                                            <tr key={doctor.id} className="hover:bg-gray-50">
                                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                                    <div className="flex items-center">
                                                                                        <div className="flex-shrink-0 h-10 w-10">
                                                                                            <img className="h-10 w-10 rounded-full" src={doctor.photo} alt={doctor.name} />
                                                                                        </div>
                                                                                        <div className="ml-4">
                                                                                            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                                                                            <div className="text-sm text-gray-500">{doctor.email}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                                    <div className="text-sm text-gray-900">{doctor.specialty}</div>
                                                                                    <div className="text-sm text-gray-500">{doctor.qualification}</div>
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                                        {doctor.experience} years
                                                                                    </span>
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                                    <div className="flex items-center">
                                                                                        {[...Array(5)].map((_, i) => (
                                                                                            <svg
                                                                                                key={i}
                                                                                                className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                                                fill="currentColor"
                                                                                                viewBox="0 0 20 20"
                                                                                            >
                                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                                            </svg>
                                                                                        ))}
                                                                                        <span className="ml-1 text-sm text-gray-500">{doctor.rating}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                                    ₹{doctor.consultationFee}
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${doctor.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                                        {"doctor.status"}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                                                                    <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                                                                                    <button onClick={()=>{
                                                                                        deletedoctor(doctor._id)
                                                                                    }} className="text-red-600 hover:text-red-900">Delete</button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* Table Footer */}
                                                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                                                <div className="flex-1 flex justify-between sm:hidden">
                                                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                                        Previous
                                                                    </button>
                                                                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                                        Next
                                                                    </button>
                                                                </div>
                                                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                                    <div>
                                                                        <p className="text-sm text-gray-700">
                                                                            Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of{' '}
                                                                            <span className="font-medium">3</span> results
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                                            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                                                                <span className="sr-only">Previous</span>
                                                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                </svg>
                                                                            </button>
                                                                            <button aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                                                                1
                                                                            </button>
                                                                            <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                                                                2
                                                                            </button>
                                                                            <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                                                                3
                                                                            </button>
                                                                            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                                                                <span className="sr-only">Next</span>
                                                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                                </svg>
                                                                            </button>
                                                                        </nav>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
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

                {/* Edit Modal */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-800">Edit Hospital Profile</h3>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <IoMdClose className="text-2xl" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={hospital.name}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="5"
                                                    step="0.1"
                                                    defaultValue={hospital.rating}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>



                                        <div className="pt-4 flex justify-end gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setIsEditing(false)}
                                                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Save Changes
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Dashboard>
    );
};

// Sample data



export default MyHospital