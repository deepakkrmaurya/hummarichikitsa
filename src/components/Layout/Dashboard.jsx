import { useState } from 'react';
import { Calendar, Clock, User, FileText, BarChart, Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Logout } from '../../Redux/doctorSlice';

const Dashboard = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, role, data } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('appointments');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // alert(role);
    const handleLogout = async () => {
            
           const res = await dispatch(Logout())
           if (res?.payload?.success) {
               localStorage.removeItem("data");
               localStorage.removeItem("isLoggedIn");
               localStorage.removeItem("role");
               localStorage.clear();
               navigate('/');
           }
       };
  return (
    <div className="container sticky top-0 mx-auto px-2 sm:px-4 py-4">
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Doctor Dashboard</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar - Hidden on mobile unless toggled */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Section */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-[rgb(43,108,176)] to-[rgb(33,88,156)] text-white">
              <div className="flex items-center">
                <img
                  src={'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                  alt={"currentUser.name"}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white mr-3 sm:mr-4"
                />
                <div>
                  <h2 className="font-semibold text-sm sm:text-lg">{data?.name}</h2>
                  <p className="text-blue-100 text-xs sm:text-sm">{data?.role || 'Doctor'}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-2 sm:p-4">
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <Link to='/doctor/dashboard'>
                    <button
                      onClick={() => {
                        setActiveTab('appointments');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'appointments'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                      <span className="font-medium">Appointments</span>
                    </button>
                  </Link>
                </li>
                {
                  role === 'doctor' &&(
                <li>
                  <Link to={`/schedule/${data?._id}`}>
                  <button
                    onClick={() => {
                      setActiveTab('schedule');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'schedule'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="font-medium">Schedule</span>
                  </button>
                  </Link>
                </li>

                  )
                }

                <li>
                  <Link to={`/book/appointment`}>
                  <button
                    onClick={() => {
                      setActiveTab('bookAppointment');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'bookAppointment'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="font-medium">Book Appointment</span>
                  </button>
                  </Link>
                </li>
                <li>
                  <Link className=' cursor-pointer' to='/patient'>
                    <button
                      onClick={() => {
                        setActiveTab('patients');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'patients'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                      <span className="font-medium">Patients</span>
                    </button>
                  </Link>
                </li>
                {/* <li>
                  <button
                    onClick={() => {
                      setActiveTab('reports');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'reports'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="font-medium">Reports</span>
                  </button>
                </li> */}
                {
                  role === 'hospital' && (
                    <li>
                      <Link to='/hospital'>
                        <button
                          onClick={() => {
                            setActiveTab('myhospital');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'myhospital'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                          <span className="font-medium">My Hospital</span>
                        </button>
                      </Link>
                    </li>
                  )
                }

                {
                  role === 'admin' && (
                    <li>
                      <Link to='/hospital/list'>
                        <button
                          onClick={() => {
                            setActiveTab('hospital');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'hospital'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                          <span className="font-medium">Hospital</span>
                        </button>
                      </Link>
                    </li>
                  )
                }
                {/* <li>
                  <button
                    onClick={() => {
                      setActiveTab('analytics');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'analytics'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <BarChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="font-medium">Analytics</span>
                  </button>
                </li> */}
                {/* <li>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="font-medium">Settings</span>
                  </button>
                </li> */}
                <li>
                  <button
                    onClick={() => {
                      handleLogout()
                    }}
                    className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition text-sm sm:text-base`}
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="font-medium">Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;