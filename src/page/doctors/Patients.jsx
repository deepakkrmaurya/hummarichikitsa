import React from 'react'
import Dashboard from '../../components/Layout/Dashboard'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAppointment, todayAppointment } from '../../Redux/appointment'
import { useEffect } from 'react'
import { Calendar, Clock, User, FileText, BarChart, Settings, Search, Calendar as CalendarIcon, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
const Patients = () => {
    const dispatch = useDispatch()
    const [appointment, setAppointment] = useState([])

    const appointments = useSelector((state) => state.appointment?.appointment);
    
    useEffect(() => {
        (
            async () => { 
                await dispatch(getAllAppointment())
            }
        )()
    }, [])
    return (
        <Dashboard>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Patients Appointments</h2>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            // value={searchTerm}
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
                            {appointments.map((appointment, index) => (
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

                {/* {filteredAppointments.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No appointments found</p>
                    </div>
                )} */}
            </div>
        </Dashboard>
    )
}

export default Patients