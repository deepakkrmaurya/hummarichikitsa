import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Filter, Star, CalendarDays } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHospital } from '../Redux/hospitalSlice';
import { getAllDoctors } from '../Redux/doctorSlice';
import Layout from '../components/Layout/Layout';

const DoctorListPage = () => {
  const navigate = useNavigate();
  const { hospitalId } = useParams();
  const hospitals = useSelector((state) => state.hospitals.hospitals);
  const {doctors} = useSelector((state) => state?.doctors);
  // console.log("Hospitals data (Redux):",doctors);
  // doctors.map((e)=>{
  //   console.log(e?.hospitalId?._id)
  // })
  const hospital = hospitals.find(h => h._id === hospitalId);

  const hospitalDoctors = doctors.filter(d => d?.hospitalId?._id === hospitalId);
  // console.log("Hospital Doctors:", hospitalDoctors);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // // Get unique specialties for filters
  const specialties = Array.from(
    new Set(hospitalDoctors.map(doctor => doctor.specialty))
  ).sort();

  const filteredDoctors = hospitalDoctors.filter(doctor => {
    return selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
  });


  // console.log("Hospitals data (Home):", hospital);
  const dispatch = useDispatch();
  useEffect(() => {
    (
      async () => {
        await dispatch(getAllHospital())
        await dispatch(getAllDoctors())
      }
    )()
  }, [])

  if (!hospital) {
    return (
      <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hospital not found</h2>
        <button
          onClick={() => navigate('/hospitals')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Hospitals
        </button>
      </div>
      </Layout>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hospital Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start">
          <div className="md:w-1/4 mb-4 md:mb-0 md:mr-6">
            <img
              src={hospital.image}
              alt={hospital.name}
              className="w-full h-auto rounded-lg object-cover"
              style={{ maxHeight: '150px' }}
            />
          </div>
          <div className="md:w-3/4">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">{hospital.name}</h1>
            <p className="text-gray-600 mb-3">{hospital.address}, {hospital.city}, {hospital.state}</p>
            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-semibold text-gray-800">{hospital.rating}</span>
              <span className="text-gray-600 text-sm ml-1">({Math.floor(Math.random() * 200) + 50} reviews)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hospital.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Section Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Doctors ({filteredDoctors.length})</h2>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filter by Specialty
        </button>
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSpecialty('')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${selectedSpecialty === ''
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition`}
                >
                  All Specialties
                </button>
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${selectedSpecialty === specialty
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-1 flex justify-end items-center">
              <button
                onClick={() => {
                  setSelectedSpecialty('');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctors List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor?._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition duration-300 hover:shadow-lg"
            >
              <div className="md:flex">
                <div className="md:w-1/4 bg-gray-50 flex items-center justify-center p-6">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>
                <div className="p-6 md:w-3/4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">{doctor.name}</h2>
                      <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                      <p className="text-gray-600 mb-2">{doctor.qualification} • {doctor.experience} Years Experience</p>
                      <div className="flex items-center mb-4">
                        <Star className="h-5 w-5 text-yellow-500 mr-1" />
                        <span className="font-semibold text-gray-800">{doctor.rating}</span>
                        <span className="text-gray-600 text-sm ml-1">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <div className="bg-green-50 px-4 py-2 rounded-md text-center mb-3">
                        <p className="text-sm text-gray-600">Consultation Fee</p>
                        <p className="text-xl font-semibold text-gray-800">₹{doctor.consultationFee}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-2">{doctor.bio}</p>

                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <CalendarDays className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-gray-700">Next Available: Today, {doctor.availableSlots[0]?.slots[0]}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/doctors/${doctor._id}`)}
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
       ))
        ) : ( 
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <h3 className="text-xl font-medium text-gray-800 mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filter criteria</p>
            <button
              // onClick={() => {
              //   // setSelectedSpecialty('');
              // }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorListPage;