


import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import avatar from '../../src/assets/logo-def.png';

const AppointmentsSection = ({ isLoggedIn, currentUser, appointments, doctors, hospital, appointmentsLoading, doctorsLoading }) => {
  const navigate = useNavigate();
  const [hospitalDoctor, setdoctors] = useState([]);

  useEffect(() => {
    setdoctors(doctors);
  }, [doctors]);

  const [activeTab, setActiveTab] = useState('active');

  // Filter appointments based on tab selection
  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === 'active') {
      if (appointment.status === "completed") return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      return appointmentDate >= today;
    } else {
      if (appointment.status === "completed") return true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      return appointmentDate < today;
    }
  });

  return (
    isLoggedIn && !currentUser?.isDoctor && (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div className="flex items-center">
              <div className="bg-blue-600 p-3 rounded-lg shadow-md">
                <Calendar className="text-white" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 ml-4">
                Your Appointments
              </h2>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-white rounded-xl shadow-sm p-1 border border-gray-200">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center ${activeTab === 'active'
                  ? 'bg-[#009689] text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-700'}`}
              >
                {activeTab === 'active' && (
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                )}
                Active
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center ${activeTab === 'completed'
                  ? 'bg-[#009689] text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-700'}`}
              >
                {activeTab === 'completed' && (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
                Completed
              </button>
            </div>

            {filteredAppointments.length > 0 && (
              <button
                onClick={() => navigate('/appointments')}
                className="bg-white text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm px-4 py-2.5 rounded-lg border border-blue-100 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
              >
                View All
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            )}
          </div>

          {appointmentsLoading || doctorsLoading ? (
            <AppointmentSkeleton />
          ) : filteredAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.slice(0, 3).map((appointment) => {
                // Fixed: Handle both object and string doctorId
                const doctor = hospitalDoctor?.find(d => d?._id === (appointment.doctorId?._id || appointment.doctorId));
                const hospitalInfo = hospital.find(h => h._id === appointment.hospitalId);
               const availability =  appointment.doctorId.availability.filter((d)=>d.date==appointment.date)
                // Determine status for display
                
                let displayStatus;
                let statusColor;
                if (appointment.status === "completed") {
                  displayStatus = "Completed";
                  statusColor = "bg-blue-100 text-blue-800";
                } else {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const appointmentDate = new Date(appointment.date);
                  appointmentDate.setHours(0, 0, 0, 0);

                  if (appointmentDate < today) {
                    displayStatus = "Completed";
                    statusColor = "bg-blue-100 text-blue-800";
                  } else if (appointmentDate.getTime() === today.getTime()) {
                    displayStatus = "Active";
                    statusColor = "bg-[#009689] text-white";
                  } else {
                    displayStatus = "Active";
                    statusColor = "bg-[#009689] text-white";
                  }
                }
              
                return (
                  <>
                    <div key={appointment._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="p-6">
                        {/* Live Status Section - Moved to Top */}
                        {displayStatus !== "Completed" && doctor?.active ? (
                          <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 mb-4 border border-green-200">
                            <div className="flex items-center space-x-2">
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                              </span>
                              <span className="font-semibold text-green-800">Doctor is Live</span>
                            </div>
                            <div className="text-right text-sm">
                              <p className="text-gray-700">
                                Current: <strong className="text-green-600">{doctor?.currentAppointment}</strong>
                              </p>
                              <p className="text-gray-700">
                                Your No: <strong className="text-blue-600">{appointment?.appointmentNumber}</strong>
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-lg py-4 px-6 shadow-sm">
                            The doctor currently has no patients to view.
                          </p>

                        )}

                        {/* Doctor Information Section */}
                        <div className="flex items-start mt-1 justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={doctor?.image || avatar}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                                alt={doctor?.name}
                              />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{doctor?.name}</h3>
                              <p className="text-sm text-gray-600">{doctor?.specialty}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                            {displayStatus}
                          </span>
                        </div>

                        {/* Hospital Information */}
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-8 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                          <span className="truncate">{hospitalInfo?.name}</span>
                        </div>

                        {/* Appointment Date & Time */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-700">
                              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                              {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                              <Clock className="w-4 h-4 mr-2 text-blue-600" />
                              {availability[0]?.display[0]}
                            </div>
                          </div>
                        </div>

                        {/* Payment & Details Section */}
                        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                            ₹{appointment.booking_amount} • {appointment.paymentMethod}
                          </div>
                          <div className="text-right">
                            <Link
                              to={`/appointment_details_page/${appointment._id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-all hover:underline"
                            >
                              View Details
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center border border-dashed border-gray-300">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                <Calendar className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {activeTab === 'active' ? 'No Active Appointments' : 'No Completed Appointments'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {activeTab === 'active'
                  ? "You don't have any upcoming appointments. Book your first appointment to get started."
                  : 'Your completed appointments will appear here for future reference.'}
              </p>
              {activeTab === 'active' && (
                <button
                  onClick={() => navigate('/hospitals')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Book Your First Appointment
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    )
  );
};

// Skeleton component for loading state
const AppointmentSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((item) => (
      <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 p-5">
        <div className="animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="mt-3 flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
              <div className="h-3 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
          <div className="mt-5 h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

export default AppointmentsSection;