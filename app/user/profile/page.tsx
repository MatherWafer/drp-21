'use client';

import React, { useState } from 'react';
import SelectRoiPage from '../../../components/selectRegion';
import { PostFeed, PostFeedProps } from '../../../components/PostFeed';

const ProfileConfigurationPage = () => {
  const [activeFeed, setActiveFeed] = useState<'bookmarked' | 'ownPosts'>('bookmarked');

  const bookmarkedProps: PostFeedProps = {
    feedUrl: '/api/posts/bookmarked',
    feedTitle: 'Your bookmarked posts:',
    showOnlyCategorySelector: true
  };

  const ownPostsProps: PostFeedProps = {
    feedUrl: '/api/posts/ownPosts',
    feedTitle: 'Your Posts:',
    showOnlyCategorySelector: true
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Configuration</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Content</h2>
        
        {/* Feed Toggle */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-2 font-medium ${activeFeed === 'bookmarked' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveFeed('bookmarked')}
          >
            Bookmarked Posts
          </button>
          <button
            className={`flex-1 py-2 font-medium ${activeFeed === 'ownPosts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveFeed('ownPosts')}
          >
            Your Posts
          </button>
        </div>
        
        {/* Feed Content */}
        {activeFeed === 'bookmarked' ? (
          <PostFeed {...bookmarkedProps} />
        ) : (
          <PostFeed {...ownPostsProps} />
        )}
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