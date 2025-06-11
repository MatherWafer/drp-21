'use client';

import React, { useState } from 'react';
import SelectRoiPage from '../../../components/selectRegion';
import { PostFeed, PostFeedProps } from '../../../components/PostFeed';
import RemoveRoiPage from '../../../components/removeRegion';

const ProfileConfigurationPage = () => {
  const [activeFeed, setActiveFeed] = useState<'bookmarked' | 'ownPosts'>('bookmarked');
  const [addingRegions, setAddingRegions] = useState<boolean>(true);

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
        <button className="px-4 py-2 mr-4 mb-3 rounded-md font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setAddingRegions(true)}>Add Region</button>
        <button className="px-4 py-2 mb-3 rounded-md font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setAddingRegions(false)}>Remove Region</button>
        {addingRegions && 
        <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <SelectRoiPage />
        </div>
        }
        {!addingRegions && 
        <div className="text-black border border-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <RemoveRoiPage />
        </div>
        }
      </div>
    </div>
  );
};

export default ProfileConfigurationPage;