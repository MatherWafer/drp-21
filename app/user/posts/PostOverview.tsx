import { useState } from 'react';
import { Post, Profile } from "@prisma/client";
import { parseCookies } from 'nookies';

export type PostInfo = {
  id: string;
  profileId: string;
  title: string;
  location: string;
  description: string;
  category: string;
  creator: Profile;
  favouriteCount: number;
  hasFavourited: boolean;
  locationText: string;
  latitude:number;
  longitude:number
  likeCount: number;
  hasLiked: boolean;
  dislikeCount: number;
  hasDisliked: boolean;
};

export default function PostOverview({ post }: { post: PostInfo }) {
  const [liked, setLiked] = useState(post.hasLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(post.likeCount);
  const [disliked, setDisliked] = useState(post.hasDisliked);
  const [currentDislikeCount, setCurrentDislikeCount] = useState(post.dislikeCount);
  const [favourited, setFavourited] = useState(post.hasFavourited);
  const [collapsed, setCollapsed] = useState(true);
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

  const handleDislike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/dislike`, {
        method: disliked ? 'DELETE' : 'POST',
        body: JSON.stringify({
          postId: post.id
        })
      });
      
      if (response.ok) {
        setDisliked(!disliked);
        setCurrentDislikeCount(disliked ? currentDislikeCount - 1 : currentDislikeCount + 1);
      }
    } catch (error) {
      console.error('Error updating dislike:', error);
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
    <div className="w-full p-6 mb-6 bg-[#d9ebff] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="justify-between items-start mb-4">
        <h3 className="text-xl text-left font-bold text-black">{post.title} </h3>
          <span className="text-sm text-gray-800 mr-2">Posted by:</span>
          <span className="text-sm font-medium text-gray-500">{post.creator.name}</span>
      </div>
      
      <p className="text-left text-blue-300 mb-3">{post.category}</p>
      {
        (collapsed && post.description.length > 50)
        ? 
        <p className="cursor-pointer text-left text-gray-600 mb-3" onClick={() => setCollapsed(!collapsed)}>
            {(() => {
              const sliced = post.description.slice(0, 50).trimEnd();
              const clean = sliced.lastIndexOf(' ') !== -1 ? sliced.slice(0, sliced.lastIndexOf(' ')) : sliced;
              return clean + '...';
            })()}
        </p>
        :
        <p className="text-left text-gray-600 mb-3" onClick={() => setCollapsed(!collapsed)}>{post.description}</p>
      }
      <div className="flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span >{post.locationText.split(',').slice(0, 2).join(',')}</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleFavourite}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              favourited 
                ? 'text-yellow-500 hover:text-yellow-400' 
                : 'text-gray-600 hover:text-white'
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
            <span className={`text-sm font-medium ${favourited ? 'text-yellow-500' : 'text-gray-600'}`}>
              {currentFavouriteCount}
            </span>
          </button>
          
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              liked 
                ? 'text-green-500 hover:text-green-400' 
                : 'text-gray-600 hover:text-white'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="currentColor"
              viewBox="0 -960 960 960" 
            >
              <path 
                d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"
              />
            </svg>

            <span className={`text-sm font-medium ${liked ? 'text-green-500' : 'text-gray-600'}`}>
              {currentLikeCount}
            </span>
          </button>

          <button 
            onClick={handleDislike}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              disliked 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gray-600 hover:text-white'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="currentColor" 
              viewBox="0 -960 960 960" 
            >
              <path 
                d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" 
              />
            </svg>
            <span className={`text-sm font-medium ${disliked ? 'text-red-500' : 'text-gray-600'}`}>
              {currentDislikeCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}