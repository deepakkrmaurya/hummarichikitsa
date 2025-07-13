import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Phone, Mail, Download, Share2 } from 'lucide-react';
import { getAllAppointment } from '../Redux/appointment';
import { getAllHospital } from '../Redux/hospitalSlice';
import { getAllDoctors } from '../Redux/doctorSlice';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout/Layout';


const ConfirmationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointmentId } = useParams();
    const hospitals = useSelector((state) => state?.hospitals?.hospitals);
    const { doctors } = useSelector((state) => state?.doctors);
    const appointments = useSelector((state) => state.appointment?.appointment);
  const appointment = appointments.find(a => a._id === appointmentId);
  // console.log(appointment);
  // console.log(appointment)
  const doctor = appointment ? doctors.find(d => d._id === appointment?.doctorId?._id) : null;
  // console.log(doctor);
  const hospital = appointment ? hospitals.find(h => h._id === appointment?.hospitalId) : null;
  // console.log(hospital);
  
  // // Update appointment status on component mount
  // useEffect(() => {
  //   if (appointment) {
  //     appointment.status = 'confirmed';
  //     appointment.paymentStatus = 'completed';
  //     appointment.paymentMethod = 'UPI';
  //     appointment.transactionId = `txn-${Date.now()}`;
  //   }
  // }, [appointment]);


  // if (!appointment || !doctor || !hospital) {
  //   return (
  //     <div className="container mx-auto px-4 py-16 text-center">
  //       <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment not found</h2>
  //       <button
  //         onClick={() => navigate('/')}
  //         className="text-blue-600 hover:text-blue-800 font-medium"
  //       >
  //         Back to Home
  //       </button>
  //     </div>
  //   );
  // }


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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Confirmation Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Appointment Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully booked and confirmed.
          </p>
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium">
            Booking ID: {appointment?.id?.toUpperCase()}
          </div>
        </div>
        
        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-semibold">Appointment Details</h2>
          </div>
          <div className="p-6">
            <div className="flex items-start mb-6">
              <img
                src={doctor?.photo}
                alt={doctor?.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{doctor?.name}</h3>
                <p className="text-blue-600">{"doctor.specialty"}</p>
                <p className="text-gray-600 text-sm">{hospital?.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium text-gray-800">{appointment?.date}, {appointment?.slot}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-800">{hospital?.address}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Payment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="font-medium text-gray-800">₹{appointment?.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-800">{appointment?.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium text-gray-800">{appointment?.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-green-600 font-medium">Paid</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium">
                <Download className="h-5 w-5 mr-1" />
                Download Receipt
              </button>
              <button className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium">
                <Share2 className="h-5 w-5 mr-1" />
                Share
              </button>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Hospital Phone</p>
                <p className="font-medium text-gray-800">{hospital?.phone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{hospital?.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex-1 text-center"
          >
            View All Appointments
          </button>
          <button
            onClick={() => navigate('/hospitals')}
            className="py-3 px-6 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition flex-1 text-center"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ConfirmationPage;