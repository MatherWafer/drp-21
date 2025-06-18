'use client';

import { useState, useEffect } from 'react';
import { Post, Profile } from '@prisma/client';
import { format, isThisYear } from 'date-fns';
import { useUser } from '../../context/userContext';
import { createClient } from '@supabase/supabase-js';

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
  latitude: number;
  postedOn: Date;
  longitude: number;
  likeCount: number;
  hasLiked: boolean;
  dislikeCount: number;
  hasDisliked: boolean;
  commentCount: number;
  imageUrl?: string | null;
};

function formatSmartDate(date: Date): string {
  const base = format(date, 'EEEE do MMMM');
  const year = format(date, ', yyyy');
  return isThisYear(date) ? base : base + year;
}

export default function PostOverview({ post }: { post: PostInfo }) {
  const [liked, setLiked] = useState(post.hasLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(post.likeCount);
  const [disliked, setDisliked] = useState(post.hasDisliked);
  const [currentDislikeCount, setCurrentDislikeCount] = useState(post.dislikeCount);
  const [favourited, setFavourited] = useState(post.hasFavourited);
  const [currentFavouriteCount, setCurrentFavouriteCount] = useState(post.favouriteCount);
  const [pendingLike, setPendingLike] = useState<boolean | null>(null);
  const [pendingDislike, setPendingDislike] = useState<boolean | null>(null);
  const [pendingFavourite, setPendingFavourite] = useState<boolean | null>(null);
  const  currentUserId: string | null = useUser().id

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
    // Like subscription
    const likeChannel = supabase
      .channel(`post-likes-${post.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Like',
          filter: `postId=eq.${post.id}`,
        },
        (payload) => {
          if (payload.errors) {
            console.error(`[${new Date().toISOString()}] Like event errors:`, payload.errors);
            return;
          }
          const profileId = payload.eventType === 'INSERT' ? payload.new.profileId : payload.old.profileId;
          if (currentUserId && profileId === currentUserId) {
            return
          }
  
          if (payload.eventType === 'INSERT') {
            setCurrentLikeCount((prev) => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setCurrentLikeCount((prev) => Math.max(prev - 1, 0));
          }
        }
      )
      .subscribe((status, error) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[${new Date().toISOString()}] Subscribed to likes for post ${post.id}`);
        }
        if (error) console.error(`[${new Date().toISOString()}] Like channel error:`, error);
      });

    // Dislike subscription
    const dislikeChannel = supabase
      .channel(`post-dislikes-${post.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Dislike',
          filter: `postId=eq.${post.id}`,
        },
        (payload) => {
          if (payload.errors) {
            console.error(`[${new Date().toISOString()}] Dislike event errors:`, payload.errors);
            return;
          }
          const profileId = payload.eventType === 'INSERT' ? payload.new.profileId : payload.old.profileId;
          if (currentUserId && profileId === currentUserId) {
            return;
          }
          if (payload.eventType === 'INSERT') {
            setCurrentDislikeCount((prev) => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setCurrentDislikeCount((prev) => Math.max(prev - 1, 0));
          }
        }
      )
      .subscribe((status, error) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[${new Date().toISOString()}] Subscribed to dislikes for post ${post.id}`);
        }
        if (error) console.error(`[${new Date().toISOString()}] Dislike channel error:`, error);
      });

    // Favourite subscription
    const favouriteChannel = supabase
      .channel(`post-favourites-${post.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Favourite',
          filter: `postId=eq.${post.id}`,
        },
        (payload) => {
          if (payload.errors) {
            console.error(`[${new Date().toISOString()}] Favourite event errors:`, payload.errors);
            return;
          }
          const profileId = payload.eventType === 'INSERT' ? payload.new.profileId : payload.old.profileId;
          if (currentUserId && profileId === currentUserId) {
            return;
          }
          if (payload.eventType === 'INSERT') {
            setCurrentFavouriteCount((prev) => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setCurrentFavouriteCount((prev) => Math.max(prev - 1, 0));
          }
        }
      )
      .subscribe((status, error) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[${new Date().toISOString()}] Subscribed to favourites for post ${post.id}`);
        }
        if (error) console.error(`[${new Date().toISOString()}] Favourite channel error:`, error);
      });

    return () => {
      console.log(`[${new Date().toISOString()}] Unsubscribing from channels for post ${post.id}`);
      supabase.removeChannel(likeChannel);
      supabase.removeChannel(dislikeChannel);
      supabase.removeChannel(favouriteChannel);
    };
  }, [post.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pendingLike !== null) return;

    const optimisticLiked = !liked;
    const optimisticCount = liked ? currentLikeCount - 1 : currentLikeCount + 1;
    setPendingLike(optimisticLiked);
    setLiked(optimisticLiked);
    setCurrentLikeCount(optimisticCount);

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: liked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update like: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error updating like:`, error);
      setLiked(liked);
      setCurrentLikeCount(liked ? currentLikeCount + 1 : currentLikeCount - 1);
    } finally {
      setPendingLike(null);
    }
  };

  const handleDislike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pendingDislike !== null) return;

    const optimisticDisliked = !disliked;
    const optimisticCount = disliked ? currentDislikeCount - 1 : currentDislikeCount + 1;
    setPendingDislike(optimisticDisliked);
    setDisliked(optimisticDisliked);
    setCurrentDislikeCount(optimisticCount);

    try {
      const response = await fetch(`/api/posts/${post.id}/dislike`, {
        method: disliked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update dislike: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error updating dislike:`, error);
      setDisliked(disliked);
      setCurrentDislikeCount(disliked ? currentDislikeCount + 1 : currentDislikeCount - 1);
    } finally {
      setPendingDislike(null);
    }
  };

  const handleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pendingFavourite !== null) return;

    const optimisticFavourited = !favourited;
    const optimisticCount = favourited ? currentFavouriteCount - 1 : currentFavouriteCount + 1;
    setPendingFavourite(optimisticFavourited);
    setFavourited(optimisticFavourited);
    setCurrentFavouriteCount(optimisticCount);

    try {
      const response = await fetch(`/api/posts/${post.id}/favourite`, {
        method: favourited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update favourite: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error updating favourite:`, error);
      setFavourited(favourited);
      setCurrentFavouriteCount(favourited ? currentFavouriteCount + 1 : currentFavouriteCount - 1);
    } finally {
      setPendingFavourite(null);
    }
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    console.log(`Opening modal for post ${post.id}`);
  };

  return (
    <div
      className="w-full p-4 mb-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border cursor-pointer"
      style={{ backgroundColor: '#d0f4d4', borderColor: '#c0e4c4' }}
      onClick={handleOpenModal}
    >
      <div className="flex justify-between items-start mb-4 border-b border-emerald-300 pb-2">
        <h3 className="text-xl font-bold text-emerald-900 tracking-normal">{post.title}</h3>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700">By {post.creator.name}</span>
          <span className="text-sm text-emerald-600">{formatSmartDate(post.postedOn)}</span>
        </div>
      </div>

      <p className="text-base font-medium text-emerald-800 mb-4 bg-emerald-50 p-1 rounded shadow-sm">
        {post.category}
      </p>

      <p className="text-sm text-emerald-900 mb-4 p-1 rounded hover:bg-emerald-50 transition-colors">
        {post.description}
      </p>

      <div className="flex justify-between items-center mb-2 border-t border-emerald-300 pt-2">
        <div className="flex items-center text-sm sm:text-base font-medium text-gray-700 bg-white p-2 sm:p-1 rounded shadow-sm">
          <svg
            className="w-4 h-4 mr-2 sm:mr-1 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{post.locationText.split(',').slice(0, 2).join(',')}</span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleFavourite}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              favourited
                ? 'bg-yellow-400 text-white hover:bg-yellow-300'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } shadow`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={favourited ? 'currentColor' : 'none'}
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
            <span className="text-sm font-medium">{currentFavouriteCount}</span>
          </button>

          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              liked
                ? 'bg-yellow-400 text-white hover:bg-yellow-300'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } shadow`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 -960 960 960"
            >
              <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
            </svg>
            <span className="text-sm font-medium">{currentLikeCount}</span>
          </button>

          <button
            onClick={handleDislike}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              disliked
                ? 'bg-red-400 text-white hover:bg-red-300'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } shadow`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 -960 960 960"
            >
              <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
            </svg>
            <span className="text-sm font-medium">{currentDislikeCount}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Opening comments for post ${post.id}`);
            }}
            className="flex items-center space-x-1 px-3 py-1 rounded-full transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300 shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h8m-8 4h8m-4-8v8m4-12H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z"
              />
            </svg>
            <span className="text-sm font-medium">{post.commentCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}