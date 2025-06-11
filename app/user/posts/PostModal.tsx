'use client';

import React, {
  useState,
  useEffect,
  useRef,
  RefObject
} from "react";
import { PostInfo } from './PostOverview';

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
  post, 
  onClose 
}: { 
  post: PostInfo, 
  onClose: () => void 
}) {

  const [comments, setComments] = useState<CommentInfo[]>([]);
  const [newComment, setNewComment] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* -------------------------------------------------------------
   * Initial fetch – grab all existing comments (incl. authors) for the post.
   * -----------------------------------------------------------*/
  useEffect(() => {
    if (!post) return;


    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/posts/${post.id}/comment`, {method: 'GET', headers: {'x-id': post.id}});
        if (res.ok) {
          const data: CommentInfo[] = await res.json();
          setComments(data);
        }
      } catch (err) {
        console.error('Failed to fetch comments', err);
      }
    };

    fetchComments();
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-id': post.id},
        body: JSON.stringify({ content: trimmed }),
      });

      if (res.ok) {
        // Server returns the freshly‑created comment including the user relation.
        const created: CommentInfo = await res.json();
        setComments((prev) => [created, ...prev]);
        setNewComment('');
        // Keep focus so the user can type another comment straight away.
        textareaRef.current?.focus();
      }
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };
  if (!post) return null;
  return (
    <div className="fixed inset-0 bg-white/50 flex items-start justify-center z-50">
      {/* scrollable modal panel */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[98vh] overflow-y-auto">
        {/* close button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        {/* post details */}
        <h3 className="text-xl font-bold text-black mb-1">{post.title}</h3>
        <p className="text-sm text-gray-800 mb-1">
          Posted by <span className="font-medium text-gray-500">{post.creator.name}</span>
        </p>
        <p className="text-blue-500 mb-3">{post.category}</p>
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.description}</p>
        <p className="text-xs text-gray-500 mb-4">Location: {post.locationText}</p>

        {post.imageUrl && (
          <div className="my-4">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-h-[50vh] object-contain rounded-lg shadow"
            />
          </div>
        )}

        {/* reactions row */}
        <div className="flex space-x-6 text-sm text-gray-700 mb-8">
          {/* Like */}
          <div className="flex items-center space-x-1 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
            </svg>
            <span>{post.likeCount}</span>
          </div>
          {/* Dislike */}
          <div className="flex items-center space-x-1 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
            </svg>
            <span>{post.dislikeCount}</span>
          </div>
          {/* Favourite */}
          <div className="flex items-center space-x-1 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{post.favouriteCount}</span>
          </div>
        </div>

        {/* ───────────────────────────────────────── */}
        {/* Comment form */}
        {/* ───────────────────────────────────────── */}
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
            Comments <span className="text-gray-500">({comments.length})</span>
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
