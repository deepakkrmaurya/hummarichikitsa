import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Calendar, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Logout } from '../Redux/doctorSlice';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    //   const { currentUser, login, logout } = useApp();
    const currentUser = JSON.parse(localStorage.getItem('data')) || null;
    const isLoggdIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogin = (isDoctor) => {
        // login(isDoctor);
        setIsMenuOpen(false);
        navigate(isDoctor ? '/doctor-dashboard' : '/');
    };
    const dispatch = useDispatch();
    const handleLogout = async () => {
        const res = await dispatch(Logout())
        if (res?.payload?.success) {
            localStorage.removeItem("data");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("role");
            localStorage.clear();
        }
        setIsMenuOpen(false);
        navigate('/');
    };

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
                        {currentUser?.role === 'doctor' || currentUser?.role === 'hospital' || currentUser?.role === 'admin' || currentUser?.role === 'staff' ? (
                            <Link to="/doctor/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                                Dashboard
                            </Link>
                        ) : (
                            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
                                My Appointments
                            </Link>
                        )}

                        {currentUser ? (
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
                                        onClick={() => handleLogin(false)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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
                            {currentUser?.role === 'doctor' || currentUser?.role === 'hospital' || currentUser?.role === 'admin' || currentUser?.role === 'staff' ? (
                                <Link
                                    to="/doctor/dashboard"
                                    className="text-gray-700 hover:text-blue-600 transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    to="/"
                                    className="text-gray-700 hover:text-blue-600 transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Appointments
                                </Link>
                            )}

                            {currentUser ? (
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
                                    <Link to='/login'>
                                        <button
                                            onClick={() => handleLogin(false)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;