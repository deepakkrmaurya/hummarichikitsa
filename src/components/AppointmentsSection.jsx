import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import avatar from '../../src/assets/logo-def.png';
const AppointmentsSection = ({ isLoggedIn, currentUser, appointments, doctors, hospital, appointmentsLoading, doctorsLoading }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  
  // Filter appointments based on tab selection
  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === 'active') {
      // For active tab, show appointments that are not completed and not in the past
      if (appointment.status === "completed") return false;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      
      return appointmentDate >= today;
    } else {
      // For completed tab, show completed appointments and past appointments
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Calendar className="mr-2 text-blue-600" size={24} />
              Your Appointments
            </h2>
            
            {/* Tab Navigation */}
            <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'active' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'}`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'completed' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'}`}
              >
                Completed
              </button>
            </div>
            
            {filteredAppointments.length > 0 && (
              <button
                onClick={() => navigate('/appointments')}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm whitespace-nowrap"
              >
                View All <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                const doctor = doctors.find(d => d._id === appointment.doctorId);
                const hospitalInfo = hospital.find(h => h._id === appointment.hospitalId);
                
                // Determine status for display
                let displayStatus;
                if (appointment.status === "completed") {
                  displayStatus = "Completed";
                } else {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const appointmentDate = new Date(appointment.date);
                  appointmentDate.setHours(0, 0, 0, 0);
                  displayStatus = appointmentDate >= today ? "Active" : "Completed";
                }
                
                return (
                  <div key={appointment._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg">
                    <div className="p-5">
                      <div className="flex items-start space-x-4">
                        <img
                          src={doctor?.image || avatar}
                          className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                          alt={doctor?.name}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">{doctor?.name}</h3>
                              <p className="text-sm text-gray-600">{doctor?.specialty}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${displayStatus === 'Active' ? 'bg-green-100 text-green-800' :
                              displayStatus === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                              {displayStatus}
                            </span>
                          </div>
                          <div className="mt-3 text-sm text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                            <span className="truncate">{hospitalInfo?.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                          {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          {appointment.slot}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                          ₹{appointment.booking_amount} • {appointment.paymentMethod}
                        </div>
                      </div>

                      <div className="mt-5 flex justify-between items-center">
                        <Link
                          to={`/appointment_details_page/${appointment._id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          View Details
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-dashed border-gray-300">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {activeTab === 'active' ? 'No Active Appointments' : 'No Completed Appointments'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'active' 
                  ? 'You don\'t have any upcoming appointments' 
                  : 'Your completed appointments will appear here'}
              </p>
              {activeTab === 'active' && (
                <button
                  onClick={() => navigate('/hospitals')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Book Appointment
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