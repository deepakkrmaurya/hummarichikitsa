

import './App.css'


import { Routes, Route } from "react-router-dom";
import Home from './page/Home';
import DoctorListPage from './page/DoctorListPage';
import HospitalListPage from './page/HospitalListPage';
import Login from './page/Login';
import DoctorDetailPage from './page/DoctorDetailPage';
import PaymentPage from './page/PaymentPage';
import ConfirmationPage from './page/ConfirmationPage';
import DoctorDashboard from './page/doctors/DoctorDashboard';
import DoctorLogin from './page/doctors/DoctorLogin';
import HospitalForm from './page/admin/HospitalForm';
import HospitalList from './page/admin/HospitalList';
import DoctorList from './page/admin/DoctorList';
import DoctorForm from './page/admin/DoctorForm';
import HospitalLogin from './page/admin/HospitalLogin';
import MyHospital from './page/admin/MyHospital';
import NotRequireAuth from './components/NotRequireAuth';
import Denied from './components/Denied';
import RequireAuth from './components/RequireAuth';
import Patients from './page/doctors/Patients';
import HospitalRegistrationForm from './page/Register';
import AdminLoginForm from './page/admin/AdminLogin';
function App() {
  return (
    <>
      <Routes>
        <Route element={<NotRequireAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLoginForm />} />
          <Route path="/patient/register" element={<HospitalRegistrationForm />} />
          <Route path='/doctor/login' element={<DoctorLogin />} />
          <Route path='/hospital/login' element={<HospitalLogin />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/hospitals/:hospitalId/doctors" element={<DoctorListPage />} />
        <Route path="/hospitals" element={<HospitalListPage />} />
        <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
        <Route path="/payment/:appointmentId" element={<PaymentPage />} />
        <Route path="/confirmation/:appointmentId" element={<ConfirmationPage />} />

        <Route element={<RequireAuth allowedRoles={["doctor", 'hospital','admin']} />}>

          <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
          <Route path='/patient' element={<Patients />} />
          
        </Route>

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        
          <Route path='/hospital/list' element={<HospitalList />} />
          <Route path='/hospital/create' element={<HospitalForm />} />

        </Route>

        <Route element={<RequireAuth allowedRoles={['hospital']} />}>

          <Route path='/doctor/list/:hospitalId' element={<DoctorList />} />
          <Route path='/doctor/create/:hospitalId' element={<DoctorForm />} />
          <Route path='/hospital' element={<MyHospital />} />

        </Route>


        {/* admin */}
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/denied" element={<Denied />} />
      </Routes>
    </>
  )
}

export default App
