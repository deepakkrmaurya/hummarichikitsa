// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Menu, X, User, Calendar, LogOut } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Logout } from '../Redux/doctorSlice';
// import SignInButton from '../page/SignInButton'
// import { AuthMe } from '../Redux/AuthLoginSlice';
// const Header = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     //   const { currentUser, login, logout } = useApp();
//     // const currentUser = JSON.parse(localStorage.getItem('data')) || null;
//     const {isLoggedIn,data} = useSelector((store) => store.LoginAuth)
//     var currentUser = data
//     const navigate = useNavigate();

//     const toggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     const handleLogin = (isDoctor) => {
//         // login(isDoctor);
//         setIsMenuOpen(false);
//         navigate(isDoctor ? '/doctor-dashboard' : '/');
//     };
//     const dispatch = useDispatch();
//     const handleLogout = async () => {
//         const res = await dispatch(Logout())
//         if (res?.payload?.success) {
//             localStorage.removeItem("data");
//             localStorage.removeItem("isLoggedIn");
//             localStorage.removeItem("role");
//             localStorage.clear();
//         }
//         setIsMenuOpen(false);
//         navigate('/');
//     };
//    useEffect(()=>{
//       dispatch(AuthMe())
//    },[dispatch])
//     return (
//         <header className="bg-white shadow-md sticky top-0 z-50">
//             <div className="container mx-auto px-4 py-3">
//                 <div className="flex items-center justify-between">
//                     <Link to="/" className="flex items-center">
//                         <Calendar className="h-8 w-8 text-blue-600" />
//                         <span className="ml-2 text-xl font-semibold text-gray-800">MediBook</span>
//                     </Link>

//                     {/* Desktop Navigation */}
//                     <nav className="hidden md:flex items-center space-x-6">
//                         <Link to="/hospitals" className="text-gray-700 hover:text-blue-600 transition">
//                             Hospitals
//                         </Link>
//                         {/* <SignInButton/> */}
//                         {currentUser?.role === 'doctor' || currentUser?.role === 'hospital' || currentUser?.role === 'admin' || currentUser?.role === 'staff' ? (
//                             <Link to="/doctor/dashboard" className="text-gray-700 hover:text-blue-600 transition">
//                                 Dashboard
//                             </Link>
//                         ) : (
//                             isLoggedIn && (
//                                 <Link to="/appointments" className="text-gray-700 hover:text-blue-600 transition">
//                                     My Appointments
//                                 </Link>
//                             )
//                         )}

//                         {isLoggedIn ? (
//                             <div className="flex items-center">

//                                 <button

//                                     onClick={handleLogout}
//                                     className="flex items-center text-gray-700 hover:text-red-600 transition"
//                                 >
//                                     <LogOut className="h-5 w-5 mr-1" />
//                                     <span>Logout</span>
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="flex space-x-2">
//                                 <Link to='/login'>
//                                     <button
                                       
//                                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
//                                     >
//                                       Patient Login
//                                     </button>
//                                 </Link>

//                                 <Link to='/doctor/login'>
//                                     <button
//                                         onClick={() => handleLogin(true)}
//                                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
//                                     >
//                                         Doctor Login
//                                     </button>
//                                 </Link>
//                             </div>
//                         )}
//                     </nav>

//                     {/* Mobile Menu Button */}
//                     <button className="md:hidden" onClick={toggleMenu}>
//                         {isMenuOpen ? (
//                             <X className="h-6 w-6 text-gray-700" />
//                         ) : (
//                             <Menu className="h-6 w-6 text-gray-700" />
//                         )}
//                     </button>
//                 </div>

//                 {/* Mobile Menu */}
//                 {isMenuOpen && (
//                     <div className="md:hidden mt-4 py-4 border-t border-gray-200">
//                         <nav className="flex flex-col space-y-4">
//                             <Link
//                                 to="/hospitals"
//                                 className="text-gray-700 hover:text-blue-600 transition"
//                                 onClick={() => setIsMenuOpen(false)}
//                             >
//                                 Hospitals
//                             </Link>
//                             {currentUser?.role === 'doctor' || currentUser?.role === 'hospital' || currentUser?.role === 'admin' || currentUser?.role === 'staff' ? (
//                                 <Link
//                                     to="/doctor/dashboard"
//                                     className="text-gray-700 hover:text-blue-600 transition"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     Dashboard
//                                 </Link>
//                             ) : (
//                                 <Link
//                                     to="/appointments"
//                                     className="text-gray-700 hover:text-blue-600 transition"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     My Appointments
//                                 </Link>
//                             )}

//                             {isLoggedIn ? (
//                                 <div className="flex flex-col space-y-2">
//                                     {/* <SignInButton/> */}
//                                     <button
//                                         onClick={handleLogout}
//                                         className="flex items-center text-gray-700 hover:text-red-600 transition"
//                                     >
//                                         <LogOut className="h-5 w-5 mr-1" />
//                                         <span>Logout</span>
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <div className="flex flex-col space-y-2">
//                                     <button className="px-4 py-2  bg-green-600 text-white rounded-md hover:bg-green-700 transition"  >

//                                         <Link to="/login" >
//                                            Patient Login
//                                         </Link>
//                                     </button>
//                                     <button
//                                         onClick={() => handleLogin(true)}
//                                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
//                                     >
//                                         <Link to='/doctor/login'>
//                                             Doctor Login
//                                         </Link>
//                                     </button>
//                                 </div>
//                             )}
//                         </nav>
//                     </div>
//                 )}
//             </div>
//         </header>
//     );
// };

// export default Header;


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Calendar, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../Redux/doctorSlice';
import { AuthMe } from '../Redux/AuthLoginSlice';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn, data } = useSelector((store) => store.LoginAuth || {});
    const currentUser = data;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogin = (isDoctor) => {
        setIsMenuOpen(false);
        navigate(isDoctor ? '/doctor-dashboard' : '/');
    };

    const handleLogout = async () => {
        try {
            const res = await dispatch(Logout());
            if (res?.payload?.success) {
                // Clear local storage
                localStorage.removeItem("data");
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("role");
                localStorage.removeItem("token");
                window.location.reload()
                setIsMenuOpen(false);
               
            }
        } catch (error) {
            console.error("Logout error:", error);
            // Fallback: clear everything and redirect
            localStorage.clear();
            setIsMenuOpen(false);
            navigate('/login');
        }
    };

    useEffect(() => {
        // alert("s bn")
            dispatch(AuthMe());
        
    }, []);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-semibold text-gray-800">MediBook</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/hospitals" className="text-gray-700 hover:text-blue-600 transition">
                            Hospitals
                        </Link>
                        
                        {currentUser?.user?.role === 'doctor' || currentUser?.user?.role === 'hospital' || currentUser?.user?.role === 'admin' || currentUser?.user?.role === 'staff' ? (
                            <Link to="/doctor/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                                Dashboard
                            </Link>
                        ) : (
                            isLoggedIn && (
                                <Link to="/appointments" className="text-gray-700 hover:text-blue-600 transition">
                                    My Appointments
                                </Link>
                            )
                        )}

                        {isLoggedIn ? (
                            <div className="flex items-center">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-700 hover:text-red-600 transition"
                                >
                                    <LogOut className="h-5 w-5 mr-1" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link to='/login'>
                                    <button
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        Patient Login
                                    </button>
                                </Link>

                                <Link to='/doctor/login'>
                                    <button
                                        onClick={() => handleLogin(true)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        Doctor Login
                                    </button>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={toggleMenu}>
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-gray-700" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                to="/hospitals"
                                className="text-gray-700 hover:text-blue-600 transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Hospitals
                            </Link>
                            {currentUser?.user?.role === 'doctor' || currentUser?.user?.role === 'hospital' || currentUser?.user?.role === 'admin' || currentUser?.user?.role === 'staff' ? (
                                <Link
                                    to="/doctor/dashboard"
                                    className="text-gray-700 hover:text-blue-600 transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                isLoggedIn && (
                                    <Link
                                        to="/appointments"
                                        className="text-gray-700 hover:text-blue-600 transition"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Appointments
                                    </Link>
                                )
                            )}

                            {isLoggedIn ? (
                                <div className="flex flex-col space-y-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center text-gray-700 hover:text-red-600 transition"
                                    >
                                        <LogOut className="h-5 w-5 mr-1" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-2">
                                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                            Patient Login
                                        </Link>
                                    </button>
                                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                                        <Link to='/doctor/login' onClick={() => setIsMenuOpen(false)}>
                                            Doctor Login
                                        </Link>
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;