import { useState } from 'react';
import { Post, Profile } from "@prisma/client";
import { parseCookies } from 'nookies';

export type PostInfo = {
  id: string;
  profileId: string;
  title: string;
  location: string;
  description: string;
  creator: Profile;
  likeCount: number;
  hasLiked: boolean;
  favouriteCount: number;
  hasFavourited: boolean;
  locationText: string;
  latitude:number;
  longitude:number
};

export default function PostOverview({ post }: { post: PostInfo }) {
  const [liked, setLiked] = useState(post.hasLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(post.likeCount);
  const [favourited, setFavourited] = useState(post.hasFavourited);
  const [currentFavouriteCount, setCurrentFavouriteCount] = useState(post.favouriteCount);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: liked ? 'DELETE' : 'POST',
        body: JSON.stringify({
          postId: post.id
        })
      });
      
      if (response.ok) {
        setLiked(!liked);
        setCurrentLikeCount(liked ? currentLikeCount - 1 : currentLikeCount + 1);
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleFavourite = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/favourite`, {
        method: favourited ? 'DELETE' : 'POST',
        body: JSON.stringify({
        postId: post.id
        })
      });
      
      if (response.ok) {
        setFavourited(!favourited);
        setCurrentFavouriteCount(favourited ? currentFavouriteCount - 1 : currentFavouriteCount + 1);
      }
    } catch (error) {
      console.error('Error updating favourite:', error);
    }
  };

  return (
    <div className="w-full p-6 mb-6 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{post.title} </h3>
        <div className="flex items-center">
          <span className="text-sm text-gray-400 mr-2">Posted by:</span>
          <span className="text-sm font-medium text-gray-300">{post.creator.name}</span>
        </div>
      </div>
      
      <p className="text-left text-gray-300 mb-3">{post.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{post.locationText}</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleFavourite}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              favourited 
                ? 'text-yellow-500 hover:text-yellow-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill={favourited ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
              />
            </svg>
            <span className={`text-sm font-medium ${favourited ? 'text-yellow-500' : 'text-gray-200'}`}>
              {currentFavouriteCount}
            </span>
          </button>
          
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              liked 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill={liked ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <span className={`text-sm font-medium ${liked ? 'text-red-500' : 'text-gray-200'}`}>
              {currentLikeCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}