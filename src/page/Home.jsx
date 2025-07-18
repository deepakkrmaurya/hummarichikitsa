import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllHospital } from "../Redux/hospitalSlice";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { AppointmentCancelled, getAllAppointment } from "../Redux/appointment";
import { getAllDoctors } from "../Redux/doctorSlice";
import Header from "../components/Header";
import Layout from "../components/Layout/Layout";
const Home = () => {
  const navigate = useNavigate();
  const hospital = useSelector((state) => state.hospitals.hospitals);
  const currentUser = localStorage.getItem('data') || null;
 const isLoggdIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
  const { doctors } = useSelector((state) => state?.doctors);
  const appointments = useSelector((state) => state.appointment?.appointment);
  // console.log("Hospitals data (Home):", hospital);
  const dispatch = useDispatch();
  const CancledAppointment = async(id)=>{
      await dispatch(AppointmentCancelled(id))
      await dispatch(getAllAppointment())
  }
  useEffect(() => {
        (
            async () => {
                await dispatch(getAllAppointment())
                await dispatch(getAllHospital())
                await dispatch(getAllDoctors())
            }
        )()
    }, [])
  return (
    <Layout>
    <div className="flex flex-col">
     
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Health, Our Priority
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Book appointments with the best doctors across multiple hospitals in just a few clicks.
              </p>
              <button
                onClick={() => navigate('/hospitals')}
                className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition duration-300 shadow-md"
              >
                Find a Doctor
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Doctor with patient"
                className="rounded-lg shadow-xl max-w-full h-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Appointments Section */}
       {isLoggdIn && !currentUser.isDoctor && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Appointments</h2>
            {appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appointment) => {
                  const doctor = doctors.find(d => d._id === appointment.doctorId);
                  const hospitals = hospital.find(h => h._id === appointment.hospitalId);
                  
                  return (
                    <div key={appointment.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition duration-300 hover:shadow-lg">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{doctor?.name}</h3>
                            <p className="text-gray-600">{doctor?.specialty}</p>
                            <p className="text-sm text-gray-500">{hospitals?.name}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-700">{appointment.date} | {appointment.slot}</span>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-700">₹{appointment.amount} - {appointment.paymentStatus}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                          {appointment.status !== 'cancelled' && (
                            <button onClick={()=>CancledAppointment(appointment?._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">No Appointments Yet</h3>
                <p className="text-gray-600 mb-4">You haven't booked any appointments yet.</p>
                <button
                  onClick={() => navigate('/hospitals')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Book an Appointment
                </button>
              </div>
            )}
          </div>
        </section>
      )} 

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Find a Doctor</h3>
              <p className="text-gray-600">
                Search for hospitals and doctors based on specialty, location, and availability.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Book Appointment</h3>
              <p className="text-gray-600">
                Select a convenient time slot from the doctor's available schedule.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Get Confirmation</h3>
              <p className="text-gray-600">
                Pay the consultation fee and receive instant confirmation for your appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hospitals */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Hospitals</h2>
            <button
              onClick={() => navigate('/hospitals')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hospital.slice(0, 3).map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition duration-300 hover:shadow-lg"
              >
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{hospital.name}</h3>
                  <p className="text-gray-600 mb-3">{hospital.address}, {hospital.city}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(hospital.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 ml-2">{hospital.rating} ({Math.floor(Math.random() * 200) + 50} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hospital.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {hospital.specialties.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                        +{hospital.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/hospitals/${hospital._id}/doctors`)}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    View Doctors
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to book your appointment?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-purple-100">
            Join thousands of patients who trust us for their healthcare needs.
          </p>
          <button
            onClick={() => navigate('/hospitals')}
            className="bg-white text-purple-700 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition duration-300 shadow-md"
          >
            Find a Doctor Now
          </button>
        </div>
      </section>
    </div>
    </Layout>
  )
}

export default Home