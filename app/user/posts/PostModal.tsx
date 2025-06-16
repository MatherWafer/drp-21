'use client';

import React, {
  useState,
  useEffect,
  useRef,
  RefObject
} from "react";
import { PostInfo } from './PostOverview';
import useSWR from "swr";

export type CommentInfo = {
  id: string;
  content: string;
  createdAt: string; // ISO string from the API
  user: {
    id: string;
    name: string;
  };
};

export default function PostModal({ 
  info, 
  onClose 
}: { 
  info: PostInfo, 
  onClose: () => void 
}) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  
  const [comments, setComments] = useState<CommentInfo[]>([]);
  const [newComment, setNewComment] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [liked, setLiked] = useState(info.hasLiked);
  const [disliked, setDisliked] = useState(info.hasDisliked);
  const [favourited, setFavourited] = useState(info.hasFavourited);
  const [likeCount, setLikeCount] = useState(info.likeCount);
  const [dislikeCount, setDislikeCount] = useState(info.dislikeCount);
  const [favouriteCount, setFavouriteCount] = useState(info.favouriteCount);


  /* -------------------------------------------------------------
  * Initial fetch – grab all existing comments (incl. authors) for the info.
  * -----------------------------------------------------------*/
 useEffect(() => {
   if (!info) return;
   
   
   const fetchComments = async () => {
     try {
       const res = await fetch(`/api/posts/${info.id}/comment`, {method: 'GET', headers: {'x-id': info.id}});
       if (res.ok) {
         const data: CommentInfo[] = await res.json();
         setComments(data);
        }
      } catch (err) {
        console.error('Failed to fetch comments', err);
      }
    };
    
    fetchComments();
  }, [info]);
  
  
  const handleToggle = async (
    type: 'like' | 'dislike' | 'favourite',
    isActive: boolean,
    setActive: (b: boolean) => void,
    setCount: (n: number) => void,
    count: number
  ) => {
    try {
      const response = await fetch(`/api/posts/${info.id}/${type}`, {
        method: isActive ? 'DELETE' : 'POST',
        body: JSON.stringify({ postId: info.id }),
      });

      if (type == 'like') {
        if(disliked) {
          await handleToggle("dislike",true, setDisliked, setDislikeCount, dislikeCount)
        }
      }
      else if (type == 'dislike') {
        if(liked) {
          await handleToggle("like",true, setLiked, setLikeCount, likeCount)
        }
      }

      if (response.ok) {
        setActive(!isActive);
        setCount(isActive ? count - 1 : count + 1);
      }
    } catch (error) {
      console.error(`Error toggling ${type}:`, error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`/api/posts/${info.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-id': info.id},
        body: JSON.stringify({ content: trimmed }),
      });

      if (res.ok) {
        const created: CommentInfo = await res.json();
        setComments((prev) => [created, ...prev]);
        setNewComment('');
        textareaRef.current?.focus();
      }
    } catch (err) {
      console.error('Failed to info comment', err);
    }
  };
  if (!info) return null;
  return (
    <div className="fixed inset-0 bg-white/50 flex items-start justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[98vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-black mb-1">{info.title}</h3>
        <p className="text-sm text-gray-800 mb-1">
          Posted by <span className="font-medium text-gray-500">{info.creator.name}</span>
        </p>
        <p className="text-blue-500 mb-3">{info.category}</p>
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{info.description}</p>
        <p className="text-xs text-gray-500 mb-4">Location: {info.locationText}</p>

        {info.imageUrl && (
          <div className="my-4">
            <img
              src={info.imageUrl}
              alt={info.title}
              className="w-full max-h-[50vh] object-contain rounded-lg shadow"
            />
          </div>
        )}

        <div className="flex space-x-6 text-sm text-gray-700 mb-8">
          <button 
              onClick={() =>
                handleToggle('favourite', favourited, setFavourited, setFavouriteCount, favouriteCount)
              }
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                favourited 
                  ? 'text-yellow-500 hover:text-yellow-400' 
                  : 'text-gray-600'
              }`}
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{favouriteCount}</span>
          </button>
          <button 
              onClick={() =>
                handleToggle('like', liked, setLiked, setLikeCount, likeCount)
              }
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                liked 
                  ? 'text-green-500 hover:text-green-400' 
                  : 'text-gray-600'
              }`}
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" className="h-5 w-5">
              <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
            </svg>
            <span>{likeCount}</span>
          </button>
          {/* Dislike */}
          <button 
              onClick={() =>
                handleToggle('dislike', disliked, setDisliked, setDislikeCount, dislikeCount)
              }
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                disliked 
                  ? 'text-red-500 hover:text-red-400' 
                  : 'text-gray-600'
              }`}
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" className="h-5 w-5">
              <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
            </svg>
            <span>{dislikeCount}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 border border-black p-3 rounded-lg space-y-2">
          <label className="block text-sm font-semibold text-black">Post Comment</label>
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Write your comment..."
            className="w-full p-2 border border-black text-black rounded resize-none focus:outline-none focus:ring-black"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            Post Comment
          </button>
        </form>

        {/* ───────────────────────────────────────── */}
        {/* Comments list (no independent scrollbar) */}
        {/* ───────────────────────────────────────── */}
        <section>
          <h4 className="text-lg font-semibold mb-4">
            <span className="text-gray-500">Comments ({comments.length})</span>
          </h4>

          <ul className="space-y-4">
            {comments.length === 0 && (
              <li className="text-sm text-gray-500">No comments yet – be the first to share your thoughts!</li>
            )}

            {comments.map((c) => (
              <li key={c.id} className="bg-gray-100 p-3 rounded-lg shadow-inner">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-800">{c.user?.name ?? "Anonymous"}</span>
                  <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
