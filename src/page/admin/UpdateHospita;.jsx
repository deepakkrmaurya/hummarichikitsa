import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Dashboard from '../../components/Layout/Dashboard';
import { useDispatch, useSelector } from 'react-redux';

import toast from 'react-hot-toast';
import { GetHospitalById } from '../../Redux/hospitalSlice';
import axiosInstance from '../../Helper/axiosInstance';

const HospitalUpdateForm = () => {
    const { hospitalid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [hospital, setHospital] = useState();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        email: '',
        website: '',
        image: '',
        rating: 2.5,
        specialties: [],
        facilities: [],
        currentSpecialty: '',
        currentFacility: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');

    // Sample suggestions
    const specialtySuggestions = [
        'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
        'Oncology', 'Dermatology', 'Gastroenterology', 'Urology'
    ];

    const facilitySuggestions = [
        'Emergency Room', 'ICU', 'Pharmacy', 'Ambulance Service',
        'Laboratory', 'Radiology', 'Cafeteria', 'Patient Parking'
    ];

    // Fetch hospital data on component mount
    useEffect(() => {
        (
            async () => {
                const res = await dispatch(GetHospitalById(hospitalid));
                const response = res.payload;
                setHospital(response)

            }
        )()
    }, [hospitalid, dispatch]);

    // Populate form when hospital data is loaded
    useEffect(() => {
        if (hospital) {
            setFormData({
                name: hospital.name || '',
                address: hospital.address || '',
                city: hospital.city || '',
                state: hospital.state || '',
                pincode: hospital.pincode || '',
                phone: hospital.phone || '',
                email: hospital.email || '',
                website: hospital.website || '',
                image: hospital.image || '',
                rating: hospital.rating || 2.5,
                specialties: hospital.specialties || [],
                facilities: hospital.facilities || [],
                currentSpecialty: '',
                currentFacility: ''
            });
        }
    }, [hospital]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Specialties handlers
    const handleAddSpecialty = () => {
        if (formData.currentSpecialty.trim() && !formData.specialties.includes(formData.currentSpecialty.trim())) {
            setFormData(prev => ({
                ...prev,
                specialties: [...prev.specialties, prev.currentSpecialty.trim()],
                currentSpecialty: ''
            }));
        }
    };

    const handleRemoveSpecialty = (index) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.filter((_, i) => i !== index)
        }));
    };

    // Facilities handlers
    const handleAddFacility = () => {
        if (formData.currentFacility.trim() && !formData.facilities.includes(formData.currentFacility.trim())) {
            setFormData(prev => ({
                ...prev,
                facilities: [...prev.facilities, prev.currentFacility.trim()],
                currentFacility: ''
            }));
        }
    };

    const handleRemoveFacility = (index) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.filter((_, i) => i !== index)
        }));
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Hospital name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (formData.specialties.length === 0) newErrors.specialties = 'At least one specialty is required';
        if (formData.facilities.length === 0) newErrors.facilities = 'At least one facility is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = axiosInstance.put(`/hospital/${hospitalid}`, formData)

            const result = (await res).data
            if (result?.success) {
                toast.success('Hospital updated successfully!');
                return
            } else {
                toast.error('Failed to update hospital');
                return
            }
        } catch (error) {
            toast.error('An error occurred while updating the hospital');
            return
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to create input props
    const getInputProps = (name) => ({
        id: name,
        name: name,
        value: formData[name],
        onChange: handleChange,
        className: `w-full px-4 py-3 rounded-lg border ${errors[name] ? 'border-red-400 focus:ring-red-300 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-300 focus:border-blue-500'
            } focus:ring-2 transition-all shadow-sm`,
    });

    // Helper for error messages
    const renderError = (fieldName) => errors[fieldName] && (
        <span className="text-red-500 text-xs mt-1">{errors[fieldName]}</span>
    );

    //   if (loading) {
    //     return (
    //       <Dashboard>
    //         <div className="flex justify-center items-center h-64">
    //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    //         </div>
    //       </Dashboard>
    //     );
    //   }

    //   if (error) {
    //     return (
    //       <Dashboard>
    //         <div className="bg-red-50 border-l-4 border-red-500 p-4">
    //           <div className="flex">
    //             <div className="flex-shrink-0">
    //               <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
    //                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    //               </svg>
    //             </div>
    //             <div className="ml-3">
    //               <p className="text-sm text-red-700">{error}</p>
    //             </div>
    //           </div>
    //         </div>
    //       </Dashboard>
    //     );
    //   }

    return (
        <Dashboard>
            <div className="min-h-screen bg-gray-50">
                <div className=" mx-auto px-4 sm:px-6">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-6 sm:px-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Update Hospital</h2>
                                    <p className="mt-1 text-blue-100">Edit the details of {hospital?.name}</p>
                                </div>
                                <button
                                    onClick={() => navigate('/hospitals')}
                                    className="text-blue-100 hover:text-white transition-colors"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            {/* Basic Information Section */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                                        <input type="text" {...getInputProps('name')} />
                                        {renderError('name')}
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea {...getInputProps('address')} rows={3}></textarea>
                                        {renderError('address')}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input type="text" {...getInputProps('city')} />
                                            {renderError('city')}
                                        </div>
                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <input type="text" {...getInputProps('state')} />
                                            {renderError('state')}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                        <input type="text" {...getInputProps('pincode')} maxLength="6" />
                                        {renderError('pincode')}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="tel" {...getInputProps('phone')} />
                                        {renderError('phone')}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input type="email" {...getInputProps('email')} />
                                        {renderError('email')}
                                    </div>
                                    <div>
                                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                        <input type="url" {...getInputProps('website')} />
                                    </div>
                                    <div>
                                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                        <input type="url" {...getInputProps('image')} />
                                        {formData.image && (
                                            <div className="mt-2">
                                                <img src={formData.image} alt="Hospital preview" className="h-32 rounded-lg border border-gray-200" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            {...getInputProps('rating')}
                                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>0</span>
                                            <span>Current: {formData.rating}</span>
                                            <span>5</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Services Section */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Services</h3>

                                {/* Specialties */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={formData.currentSpecialty}
                                            onChange={(e) => setFormData({ ...formData, currentSpecialty: e.target.value })}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                            placeholder="Add specialty"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSpecialty}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {renderError('specialties')}

                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {specialtySuggestions.map((spec) => (
                                            <button
                                                key={spec}
                                                type="button"
                                                onClick={() => !formData.specialties.includes(spec) &&
                                                    setFormData({ ...formData, specialties: [...formData.specialties, spec] })}
                                                className={`px-3 py-1 text-sm rounded-full ${formData.specialties.includes(spec)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                    }`}
                                            >
                                                {spec}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {formData.specialties.map((spec, index) => (
                                            <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                {spec}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSpecialty(index)}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Facilities */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={formData.currentFacility}
                                            onChange={(e) => setFormData({ ...formData, currentFacility: e.target.value })}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                            placeholder="Add facility"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddFacility}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {renderError('facilities')}

                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {facilitySuggestions.map((fac) => (
                                            <button
                                                key={fac}
                                                type="button"
                                                onClick={() => !formData.facilities.includes(fac) &&
                                                    setFormData({ ...formData, facilities: [...formData.facilities, fac] })}
                                                className={`px-3 py-1 text-sm rounded-full ${formData.facilities.includes(fac)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                    }`}
                                            >
                                                {fac}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {formData.facilities.map((fac, index) => (
                                            <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                {fac}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFacility(index)}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-between pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate('/hospitals')}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Hospital'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

export default HospitalUpdateForm;