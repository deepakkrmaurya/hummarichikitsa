
import './App.css'
import { useSelector } from 'react-redux';
import Loading from './components/Loading';
import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from './components/RequireAuth';
import NotRequireAuth from './components/NotRequireAuth';
import InternetChecker from './components/InternetChecker';
import SignInButton from './page/SignInButton';


const Home = lazy(() => import('./page/Home'))
const DoctorListPage = lazy(() => import('./page/DoctorListPage'))
const HospitalListPage = lazy(() => import('./page/HospitalListPage'))
const DoctorDetailPage = lazy(() => import('./page/DoctorDetailPage'))
const PaymentPage = lazy(() => import('./page/PaymentPage'))
const ConfirmationPage = lazy(() => import('./page/ConfirmationPage'))
const DoctorDashboard = lazy(() => import('./page/doctors/DoctorDashboard'))
const DoctorLogin = lazy(() => import('./page/doctors/DoctorLogin'))
const HospitalForm = lazy(() => import('./page/admin/HospitalForm'))
const HospitalList = lazy(() => import('./page/admin/HospitalList'))
const DoctorList = lazy(() => import('./page/admin/DoctorList'))
const DoctorForm = lazy(() => import('./page/admin/DoctorForm'))
const MyHospital = lazy(() => import('./page/admin/MyHospital'))
const Denied = lazy(() => import('./components/Denied'))
const Patients = lazy(() => import('./page/doctors/Patients'))
const AppointmentDetails = lazy(() => import('./page/doctors/Appointment'))
const AppointmentDetailsPage = lazy(() => import('./page/AppointmentDetails'))
const MobileOTPLogin = lazy(() => import('./page/Login'))
const HospitalDetails = lazy(() => import('./page/admin/HospitalDetails'))
const DoctorDetailsPage = lazy(() => import('./page/doctors/DoctorDetails'))
const HospitalUpdateForm = lazy(() => import('./page/admin/UpdateHospita;'))
const StaffRegistrationForm = lazy(() => import('./page/admin/StaffRegister'))
const BookAppointment = lazy(() => import('./page/admin/BookAppointment'))
const Payment = lazy(() => import('./page/Payment'))
const UpdateDoctor = lazy(() => import('./page/admin/UpdateDoctor'))
const Schedule = lazy(() => import('./page/doctors/Schedule'))
const NotFoundPage = lazy(() => import('./components/NotFoundPage'))
const Appointment = lazy(() => import('./page/Appointment'))
const Contact = lazy(() => import('./page/Contact'))
function App() {
  const { isLoggedIn } = useSelector((state) => state?.auth)
  // useEffect(() => {
  //   // Right-click disable
  //   const handleContextMenu = (e) => e.preventDefault();
  //   document.addEventListener("contextmenu", handleContextMenu);

  //   // DevTools shortcuts disable
  //   const handleKeyDown = (e) => {
  //     if (
  //       e.key === "F12" ||
  //       (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key)) ||
  //       (e.ctrlKey && e.key === "U")
  //     ) {
  //       e.preventDefault();
  //       alert("Inspect is disabled!");
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);
 
  return (

    <>
      <InternetChecker>

        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<NotRequireAuth />}>
              {/* <Route path="/login" element={<MobileOTPLogin />} /> */}
              <Route path="/login" element={<SignInButton />} />
              <Route path='/doctor/login' element={<DoctorLogin />} />

            </Route>

            <Route path='/payment' element={<Payment />} />
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hospitals/:hospitalId/doctors" element={<DoctorListPage />} />
            <Route path="/hospitals" element={<HospitalListPage />} />
            <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
            <Route path="/appointments" element={<Appointment />} />
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

            <Route element={<RequireAuth allowedRoles={['doctor']} />}>
              <Route path='/schedule/:id' element={<Schedule />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={['hospital', "admin"]} />}>
              <Route path="/staff/register/:hospitalid" element={<StaffRegistrationForm />} />
              <Route path='/doctor/list/:hospitalId' element={<DoctorList />} />
              <Route path='/doctor/create/:hospitalId' element={<DoctorForm />} />
              <Route path='/hospital' element={<MyHospital />} />
              <Route path='/hospital/:id' element={<HospitalDetails />} />

              <Route path='/doctor/:doctorId' element={<DoctorDetailsPage />} />
              <Route path='/update/doctor/:doctorid' element={<UpdateDoctor />} />
              <Route path='/hospital/update/:hospitalid' element={<HospitalUpdateForm />} />

            </Route>


            {/* admin */}
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/denied" element={<Denied />} />
          </Routes >
        </Suspense>
      </InternetChecker>
    </>
  )
}

export default App
