'use client';

import React, { useState } from 'react';
import SelectRoiPage from '../../../components/selectRegion';
import { PostFeed, PostFeedProps } from '../../../components/PostFeed';
import RemoveRoiPage from '../../../components/removeRegion';
import { useUser } from '../../context/userContext';
import RoiDisplay from './components/RoiDisplay';

const ProfileConfigurationPage = () => {
  const [activeFeed, setActiveFeed] = useState<'bookmarked' | 'ownPosts'>('bookmarked');
  const [addingRegions, setAddingRegions] = useState<boolean>(false);
  const { interestRegions, loadProfile } = useUser(); // Get from your context

  const handleDelete = async (id: string, name: string) => {
    console.log("Confirmy")
    const confirmed = (name == "")
            ? 
        window.confirm(`Are you sure you want to delete this region?`)
            :
        window.confirm(`Are you sure you want to delete the region: ${name}?`)
    if (!confirmed) return;
    
    const res = await fetch('/api/select-roi', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });

    if (res.ok && loadProfile) {
      await loadProfile(); // refresh regions
    } else {
      alert("Failed to delete region.");
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Configuration</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Content</h2>
        
        {/* Feed Toggle */}
        <div className="flex gap-4 mb-6">
          <a
            href="/user/posts/ownPosts"
            className='px-4 py-2 rounded-md font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200'
          >
            Your Posts
          </a>
          <a
            href="/user/posts/bookmarked"
            className='px-4 py-2 rounded-md font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200'
          >
            Bookmarked Posts
          </a>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Your Regions of Interest</h2>
        
        {/* Regions List */}
        <div className="mb-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {interestRegions.map((region) => (
            <RoiDisplay
              key={region.id}
              apiKey={"AIzaSyCGTpExS27yGMpb0fccyQltC1xQe9R6NVY"}
              interestRegion={region}
              onDelete={() =>{handleDelete(region.id,region.name)}}
            />
          ))}
        </div>
          
          {/* Add ROI Button */}
          <button
            onClick={() => setAddingRegions(true)}
            className="w-full px-4 py-3 rounded-md font-medium transition-colors 
                     bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200
                     flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Region of Interest
          </button>
        </div>

        {/* Add/Remove Region Panels */}
        {addingRegions && (
          <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            <SelectRoiPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileConfigurationPage;