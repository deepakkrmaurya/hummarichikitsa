

import './App.css'


import { Routes, Route, Navigate } from "react-router-dom";
import Home from './page/Home';
import DoctorListPage from './page/DoctorListPage';
import HospitalListPage from './page/HospitalListPage';
import DoctorDetailPage from './page/DoctorDetailPage';
import PaymentPage from './page/PaymentPage';
import ConfirmationPage from './page/ConfirmationPage';
import DoctorDashboard from './page/doctors/DoctorDashboard';
import DoctorLogin from './page/doctors/DoctorLogin';
import HospitalForm from './page/admin/HospitalForm';
import HospitalList from './page/admin/HospitalList';
import DoctorList from './page/admin/DoctorList';
import DoctorForm from './page/admin/DoctorForm';
import MyHospital from './page/admin/MyHospital';
import NotRequireAuth from './components/NotRequireAuth';
import Denied from './components/Denied';
import RequireAuth from './components/RequireAuth';
import Patients from './page/doctors/Patients';
import AppointmentDetails from './page/doctors/Appointment';
import AppointmentDetailsPage from './page/AppointmentDetails';
import MobileOTPLogin from './page/Login';
import HospitalDetails from './page/admin/HospitalDetails';
import DoctorDetailsPage from './page/doctors/DoctorDetails';
import HospitalUpdateForm from './page/admin/UpdateHospita;';
import StaffRegistrationForm from './page/admin/StaffRegister';
import BookAppointment from './page/admin/BookAppointment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Payment from './page/Payment';
function App() {
  const { isLoggedIn } = useSelector((state) => state?.auth)


  return (
    <>
      <Routes>
        <Route element={<NotRequireAuth />}>
          <Route path="/login" element={<MobileOTPLogin />} />
          <Route path='/doctor/login' element={<DoctorLogin />} />

        </Route>

        <Route path='/payment'element={<Payment/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/hospitals/:hospitalId/doctors" element={<DoctorListPage />} />
        <Route path="/hospitals" element={<HospitalListPage />} />
        <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
        <Route path="/payment/:appointmentId" element={<PaymentPage />} />
        <Route path="/confirmation/:appointmentId" element={<ConfirmationPage />} />
        <Route path="/appointment_details_page/:id" element={<AppointmentDetailsPage />} />

        <Route element={<RequireAuth allowedRoles={["doctor", 'hospital', 'admin', 'staff']} />}>

          <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
          <Route path='/patient' element={<Patients />} />
          <Route path='/book/appointment' element={<BookAppointment />} />
          <Route path='/appointment/:id' element={<AppointmentDetails />} />

        </Route>

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>

          <Route path='/hospital/list' element={<HospitalList />} />
          <Route path='/hospital/create' element={<HospitalForm />} />

        </Route>

        <Route element={<RequireAuth allowedRoles={['hospital', "admin"]} />}>
          <Route path="/staff/register/:hospitalid" element={<StaffRegistrationForm />} />
          <Route path='/doctor/list/:hospitalId' element={<DoctorList />} />
          <Route path='/doctor/create/:hospitalId' element={<DoctorForm />} />
          <Route path='/hospital' element={<MyHospital />} />
          <Route path='/hospital/:id' element={<HospitalDetails />} />
          <Route path='/doctor/:doctorId' element={<DoctorDetailsPage />} />
          <Route path='/hospital/update/:hospitalid' element={<HospitalUpdateForm />} />

        </Route>


        {/* admin */}
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/denied" element={<Denied />} />
      </Routes >
    </>
  )
}

export default App
