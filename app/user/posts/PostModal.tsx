'use client';

import { PostInfo } from './PostOverview';

export default function PostModal({ post, onClose }: { post: PostInfo, onClose: () => void }) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-start justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button 
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-xl text-left font-bold text-black">{post.title} </h3>
        <span className="text-sm text-gray-800 mr-2">Posted by:</span>
        <span className="text-sm font-medium text-gray-500">{post.creator.name}</span>
        <p className="text-blue-400 mb-3">{post.category}</p>
        <p className="text-gray-800 mb-4">{post.description}</p>
        <p className="text-xs text-gray-500">Location: {post.locationText}</p>
        <div className="mt-4 flex space-x-4 text-sm text-gray-700">
        <div className="mt-4 flex space-x-6 text-sm text-gray-700">
          {/* Like */}
          <div className="flex items-center space-x-1 text-red-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="h-5 w-5"
            >
              <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
            </svg>
            <span>{post.likeCount}</span>
          </div>

          {/* Dislike */}
          <div className="flex items-center space-x-1 text-blue-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="h-5 w-5"
            >
              <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
            </svg>
            <span>{post.dislikeCount}</span>
          </div>

          {/* Favourite */}
          <div className="flex items-center space-x-1 text-yellow-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="h-5 w-5"
            >
              <path 
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
              />
            </svg>
            <span>{post.favouriteCount}</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
