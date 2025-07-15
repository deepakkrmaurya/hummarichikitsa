import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, FileText, BarChart, Settings, Search, Calendar as CalendarIcon, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
// import { Search, Calendar as CalendarIcon, CheckCircle, Clock as ClockIcon } from 'lucide-react';
import { getAllAppointment, todayAppointment } from '../../Redux/appointment';
import { getAllHospital } from '../../Redux/hospitalSlice';
import { getAllDoctors } from '../../Redux/doctorSlice';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../../components/Layout/Dashboard';
import axios from 'axios';
import axiosInstance from '../../Helper/axiosInstance';


const DoctorDashboard = () => {
  const { isLoggedIn, role, data } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [appointment,setAppointment]=useState([])
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const hospitals = useSelector((state) => state?.hospitals?.hospitals);
  const { doctors } = useSelector((state) => state?.doctors);
  const appointments = useSelector((state) => state.appointment?.appointment);
  // If not logged in as a doctor, redirect to home
  //   if (!currentUser || !currentUser.isDoctor) {
  //     return (
  //       <div className="container mx-auto px-4 py-16 text-center">
  //         <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
  //         <p className="text-gray-600 mb-6">You must be logged in as a doctor to view this page.</p>
  //         <button
  //           onClick={() => navigate('/')}
  //           className="text-blue-600 hover:text-blue-800 font-medium"
  //         >
  //           Back to Home
  //         </button>
  //       </div>
  //     );
  //   }

  // Get appointments for the current doctor
  //   const doctor = doctors.find(d => d.id === 'doc-1'); // Assuming the logged-in doctor
  //   const appointments = getAppointmentsForDoctor(doctor?.id || ''); 
  //   // Filter appointments based on search term
  const filteredAppointments = appointments?.filter(appointment =>
    appointment._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAppointment = async () => {
  
    // alert(formattedDate)
    const res = await dispatch(todayAppointment())
    setAppointment(res.payload.appointments)
    console.log(res.payload.appointments)
  }

  useEffect(() => {
    (
      async () => {
        const res = axiosInstance.patch('/appointment/hospital/patient')
        await getAppointment()
        // await dispatch(getAllAppointment())
        // await dispatch(getAllHospital())
        // await dispatch(getAllDoctors())
      }
    )()
  }, [])
  return (
    <Dashboard>
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Today's Appointments</p>
                  <p className="text-2xl font-semibold text-gray-800">{appointments?.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Confirmed</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {appointments?.filter(a => a.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {appointments?.filter(a => a.status === 'booked').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Today's Appointments</h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
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
                  {appointment?.map((appointment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Patient ID: {index + 1}</div>
                            <div className="text-sm text-gray-500">Appointment ID: {appointment?.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment?.slot}</div>
                        <div className="text-sm text-gray-500">{appointment?.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment?.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : appointment?.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {appointment?.status.charAt(0).toUpperCase() + appointment?.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment?.paymentStatus === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {appointment?.paymentStatus.charAt(0).toUpperCase() + appointment?.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        {appointment?.status === 'booked' && (
                          <>
                            <button className="text-green-600 hover:text-green-900 mr-3">Confirm</button>
                            <button className="text-red-600 hover:text-red-900">Cancel</button>
                          </>
                        )}
                        {appointment?.status === 'confirmed' && (
                          <button className="text-purple-600 hover:text-purple-900">Complete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No appointments found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab !== 'appointments' && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Feature
          </h2>
          <p className="text-gray-600 mb-6">
            This feature is not implemented in the demo version.
          </p>
          <button
            onClick={() => setActiveTab('appointments')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Appointments
          </button>
        </div>
      )}
    </Dashboard>
  );
};

export default DoctorDashboard;