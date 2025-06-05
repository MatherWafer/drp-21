'use client';

import React from 'react';
import SelectRoiPage from '../../../components/selectRegion';
const ProfileConfigurationPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Configuration</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Other Settings</h2>
        {/* Placeholder for other configuration options */}
        <div className="p-4 border border-gray-200 rounded-lg mb-4">
          <p className="text-gray-600">Other profile settings will go here</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Your Region of Interest</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <SelectRoiPage />
        </div>
      </div>

    </div>
  );
};

export default ProfileConfigurationPage;