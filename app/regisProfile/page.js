'use client';
import React, { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterInformationPage() {
  const router = useRouter();
  const email = sessionStorage.getItem('userEmail');
  const password = sessionStorage.getItem('userPassword');
  const [selectedFile, setSelectedFile] = useState(null);

  const [userData, setUserData] = useState({
    email: email || '',
    password: password || '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    lineurl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.firstName || !userData.lastName || !userData.phoneNumber || !userData.lineurl) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!selectedFile) {
      toast.error('Please upload a profile image.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phoneNumber', userData.phoneNumber);
      formData.append('lineurl', userData.lineurl);
      formData.append('profileImage', selectedFile);

      const response = await fetch('/api/regisProInfo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'An error occurred during registration');
      }

      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userPassword');
      toast.success('Registration successful!');
      sessionStorage.setItem('lessorId', result.lessorId);
      router.push('/regisPark');
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred. Please try again later.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />
      <div className="relative flex-grow overflow-y-auto p-6">
        <button onClick={() => router.push('/welcomerentor')} className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-16 py-4">
          Your Information for a <br /> Smooth Reservation Experience
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
          {/* Input fields */}
          <div className="w-11/12">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={userData.firstName}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={userData.lastName}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={userData.phoneNumber}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <input
              type="text"
              name="lineurl"
              placeholder="Line URL"
              value={userData.lineurl}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <h2 className="text-gray-600 font-semibold mb-2">Profile Image</h2>
            <input type="file" onChange={handleFileChange} />
          </div>

          <div className="flex justify-center mb-4 w-4/5 mx-auto">
            <button type="submit" className="w-full bg-customBlue text-white py-3 rounded-lg hover:bg-blue-500">
              Get started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
