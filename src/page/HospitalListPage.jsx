import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Phone, Star, Filter} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHospital } from '../Redux/hospitalSlice';
import { getAllDoctors } from '../Redux/doctorSlice';
import Layout from '../components/Layout/Layout';


const HospitalListPage = () => {
    const navigate = useNavigate();
    const hospitals = useSelector((state) => state.hospitals.hospitals);
      const {doctors} = useSelector((state) => state?.doctors);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Get unique cities and specialties for filters
    const cities = Array.from(new Set(hospitals.map(hospital => hospital.city)));
    const specialties = Array.from(
        new Set(hospitals.flatMap(hospital => hospital.specialties))
    ).sort();

    const filteredHospitals = hospitals.filter(hospital => {
        const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity ? hospital.city === selectedCity : true;
        const matchesSpecialty = selectedSpecialty
            ? hospital.specialties.includes(selectedSpecialty)
            : true;

        return matchesSearch && matchesCity && matchesSpecialty;
    });

    const dispatch = useDispatch();
    useEffect(() => {
        (
            async () => {
                await dispatch(getAllDoctors())
                await dispatch(getAllHospital())
            }
        )()
    }, [])

    return (
          <Layout>
<div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Find a Hospital</h1>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search hospitals by name or location"
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition md:w-auto w-full"
                    >
                        <Filter className="h-5 w-5 mr-2" />
                        Filters
                    </button>
                </div>

                {isFilterOpen && (
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Cities</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Specialties</option>
                                {specialties.map((specialty) => (
                                    <option key={specialty} value={specialty}>
                                        {specialty}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Section */}
            <div className="space-y-6">
                {filteredHospitals.length > 0 ? (
                    filteredHospitals.map((hospital) => (
                        <div
                            key={hospital._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition duration-300 hover:shadow-lg"
                        >
                            <div className="md:flex">
                                <div className="md:w-1/3">
                                    <img
                                        src={hospital.image}
                                        alt={hospital.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="p-6 md:w-2/3">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{hospital.name}</h2>
                                            <div className="flex items-center mb-3">
                                                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                                                <span className="text-gray-600">{hospital.address}, {hospital.city}, {hospital.state}</span>
                                            </div>
                                            <div className="flex items-center mb-4">
                                                <Phone className="h-5 w-5 text-gray-500 mr-2" />
                                                <span className="text-gray-600">{hospital.phone}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex items-center">
                                            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-md">
                                                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                                                <span className="font-semibold text-gray-800">{hospital.rating}</span>
                                                <span className="text-gray-600 text-sm ml-1">({Math.floor(Math.random() * 200) + 50} reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Specialties</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {hospital.specialties.map((specialty, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                                                >
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800">{doctors.filter(d => d?.hospitalId?._id === hospital?._id).length} Doctors Available</h3>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/hospitals/${hospital._id}/doctors`)}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                                        >
                                            View Doctors
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-lg p-8 text-center shadow-md">
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No hospitals found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCity('');
                                setSelectedSpecialty('');
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
        
          </Layout>
    );
};

export default HospitalListPage;