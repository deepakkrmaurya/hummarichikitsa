import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Phone, Mail, Download, Share2, ChevronLeft } from 'lucide-react';
import { getAllAppointment } from '../Redux/appointment';
import { getAllHospital } from '../Redux/hospitalSlice';
import { getAllDoctors } from '../Redux/doctorSlice';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout/Layout';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointmentId } = useParams();
  
  // Redux state
  const hospitals = useSelector((state) => state?.hospitals?.hospitals);
  const { doctors, loading: doctorsLoading } = useSelector((state) => state?.doctors);
  const { appointment: appointments, loading: appointmentsLoading } = useSelector((state) => state.appointment);
  const { loading: hospitalsLoading } = useSelector((state) => state.hospitals);
  
  // Find appointment, doctor, and hospital
  const appointment = appointments.find(a => a._id === appointmentId);
  const doctor = appointment ? doctors.find(d => d._id === appointment?.doctorId?._id) : null;
  const hospital = appointment ? hospitals.find(h => h._id === appointment?.hospitalId) : null;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time slot
  const formatTimeSlot = (slot) => {
    if (!slot) return '';
    return slot.replace(/(\d+)([ap]m)/i, '$1 $2').toUpperCase();
  };

  // Generate QR code data
  const qrData = JSON.stringify({
    appointmentId: appointment?._id,
    patientName: appointment?.patient,
    doctorName: doctor?.name,
    date: appointment?.date,
    time: appointment?.slot,
    hospital: hospital?.name
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getAllAppointment()),
          dispatch(getAllHospital()),
          dispatch(getAllDoctors())
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, [dispatch]);

  // Loading state
  if (appointmentsLoading || hospitalsLoading || doctorsLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Confirmation Header Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center border border-teal-100">
              <Skeleton circle width={80} height={80} className="mb-6 mx-auto" />
              <Skeleton width={250} height={30} className="mb-2 mx-auto" />
              <Skeleton width={300} height={20} className="mb-6 mx-auto" />
              <Skeleton width={200} height={30} className="mx-auto" />
            </div>
            
            {/* Appointment Details Skeleton */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-teal-100">
              <Skeleton height={50} className="bg-teal-600 mb-0" />
              <div className="p-6">
                <div className="flex items-start mb-6">
                  <Skeleton circle width={64} height={64} className="mr-4" />
                  <div>
                    <Skeleton width={150} height={20} className="mb-2" />
                    <Skeleton width={100} height={16} className="mb-1" />
                    <Skeleton width={120} height={14} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-start">
                      <Skeleton circle width={20} height={20} className="mr-2 mt-0.5" />
                      <div>
                        <Skeleton width={80} height={14} className="mb-1" />
                        <Skeleton width={120} height={16} />
                      </div>
                    </div>
                  ))}
                </div>
                
                <Skeleton height={1} className="mb-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton width={100} height={14} className="mb-1" />
                      <Skeleton width={150} height={16} />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Skeleton width={120} height={40} />
                  <Skeleton width={80} height={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Appointment not found state
  if (!appointment || !doctor || !hospital) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment not found</h2>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center mx-auto px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Home
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-teal-600 hover:text-teal-800 mb-6 transition font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>

          {/* Confirmation Header */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center border border-teal-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-50 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Appointment Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your appointment with Dr. {doctor?.name} has been successfully booked.
            </p>
            <div className="inline-block bg-teal-50 text-teal-800 px-4 py-2 rounded-lg font-medium border border-teal-100">
              Booking ID: {appointment?.razorpayOrderId?.slice(0,15).toUpperCase()}
            </div>
          </div>
          
          {/* Appointment Details Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-teal-100">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white p-4">
              <h2 className="text-xl font-semibold">Appointment Details</h2>
            </div>
            
            <div className="p-6">
              {/* Doctor Info */}
              <div className="flex items-start mb-6">
                <img
                  src={doctor?.photo || '/default-doctor.jpg'}
                  alt={doctor?.name}
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-doctor.jpg';
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Dr. {doctor?.name}</h3>
                  <p className="text-teal-600">{doctor?.specialty}</p>
                  <p className="text-gray-600 text-sm">{hospital?.name}</p>
                </div>
              </div>
              
              {/* Date & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start bg-teal-50 p-3 rounded-lg">
                  <Calendar className="h-5 w-5 text-teal-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(appointment?.date)}, {formatTimeSlot(appointment?.slot)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start bg-teal-50 p-3 rounded-lg">
                  <MapPin className="h-5 w-5 text-teal-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-800">
                      {hospital?.address}, {hospital?.city}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* QR Code Section */}
              <div className="border-t border-gray-100 pt-4 mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Check-in QR Code</h4>
                <div className="flex flex-col items-center p-4 bg-teal-50 rounded-lg">
                  <QRCode 
                    value={qrData} 
                    size={128} 
                    bgColor="#ffffff" 
                    fgColor="#0d9488" 
                    level="Q" 
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Show this code at the reception for quick check-in
                  </p>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="border-t border-gray-100 pt-4 mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium text-gray-800">₹{appointment?.amount}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-800">
                      {appointment?.paymentMethod || 'Online Payment'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-medium text-gray-800">
                      {appointment?.razorpayPaymentId || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-teal-600 font-medium">
                      {appointment?.paymentStatus === 'Complete' ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button 
                  className="flex items-center justify-center text-teal-600 hover:text-teal-800 transition font-medium py-2 px-4 bg-teal-50 rounded-lg hover:bg-teal-100"
                  onClick={() => {
                    // Implement download functionality
                    toast.success('Receipt download started');
                  }}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Receipt
                </button>
                <button 
                  className="flex items-center justify-center text-teal-600 hover:text-teal-800 transition font-medium py-2 px-4 bg-teal-50 rounded-lg hover:bg-teal-100"
                  onClick={() => {
                    // Implement share functionality
                    toast.success('Appointment details shared');
                  }}
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Appointment
                </button>
              </div>
            </div>
          </div>
          
          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Important Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-teal-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Important Notes
              </h2>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>Please arrive 15 minutes before your scheduled appointment time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>Bring your ID and any relevant medical records</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>Face masks are required in all clinical areas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>Cancellations require 24 hours notice</span>
                </li>
              </ul>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-teal-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-teal-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Hospital Phone</p>
                    <a 
                      href={`tel:${hospital?.phone}`} 
                      className="font-medium text-gray-800 hover:text-teal-600 transition"
                    >
                      {hospital?.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-teal-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a 
                      href={`mailto:${hospital?.email}`} 
                      className="font-medium text-gray-800 hover:text-teal-600 transition"
                    >
                      {hospital?.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-teal-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">
                      {hospital?.address}, {hospital?.city}, {hospital?.state} - {hospital?.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              className="py-3 px-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg hover:from-teal-700 hover:to-teal-600 transition flex-1 text-center shadow-sm"
            >
              View All Appointments
            </button>
            <button
              onClick={() => navigate(`/doctors/${doctor?._id}`)}
              className="py-3 px-6 bg-white border border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 transition flex-1 text-center shadow-sm"
            >
              Book Follow-up
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmationPage;