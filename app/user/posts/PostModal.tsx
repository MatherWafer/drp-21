import { useState, useRef } from 'react';
import { PostInfo } from './PostOverview'; // assuming you export PostInfo from PostOverview or define elsewhere

type PostModalProps = {
  post: PostInfo | null;
  onClose: () => void;
};

export default function PostModal({ post, onClose }: PostModalProps) {
  // If no post, render nothing
  if (!post) return null;

  // Reaction state hooks from PostOverview logic:
  const [liked, setLiked] = useState(post.hasLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(post.likeCount);
  const [disliked, setDisliked] = useState(post.hasDisliked);
  const [currentDislikeCount, setCurrentDislikeCount] = useState(post.dislikeCount);
  const [favourited, setFavourited] = useState(post.hasFavourited);
  const [currentFavouriteCount, setCurrentFavouriteCount] = useState(post.favouriteCount);

  const [freshPost, setFreshPost] = useState<PostInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Comment state (for your form)
  const [newComment, setNewComment] = useState('');
  interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  } | null;
}

const [comments, setComments] = useState<Comment[]>([]);
const textareaRef = useRef<HTMLTextAreaElement>(null);


  // Like handler
  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: liked ? 'DELETE' : 'POST',
        body: JSON.stringify({ postId: post.id }),
      });
      if (response.ok) {
        setLiked(!liked);
        setCurrentLikeCount(liked ? currentLikeCount - 1 : currentLikeCount + 1);
        // Optionally reset dislike if mutually exclusive:
        if (disliked && !liked) {
          setDisliked(false);
          setCurrentDislikeCount(currentDislikeCount - 1);
        }
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  // Dislike handler
  const handleDislike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/dislike`, {
        method: disliked ? 'DELETE' : 'POST',
        body: JSON.stringify({ postId: post.id }),
      });
      if (response.ok) {
        setDisliked(!disliked);
        setCurrentDislikeCount(disliked ? currentDislikeCount - 1 : currentDislikeCount + 1);
        // Optionally reset like if mutually exclusive:
        if (liked && !disliked) {
          setLiked(false);
          setCurrentLikeCount(currentLikeCount - 1);
        }
      }
    } catch (error) {
      console.error('Error updating dislike:', error);
    }
  };

  // Favourite handler
  const handleFavourite = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/favourite`, {
        method: favourited ? 'DELETE' : 'POST',
        body: JSON.stringify({ postId: post.id }),
      });
      if (response.ok) {
        setFavourited(!favourited);
        setCurrentFavouriteCount(favourited ? currentFavouriteCount - 1 : currentFavouriteCount + 1);
      }
    } catch (error) {
      console.error('Error updating favourite:', error);
    }
  };

  // Combined handler for your buttons
  const handleReaction = (type: 'like' | 'dislike' | 'favourite') => {
    if (type === 'like') return handleLike();
    if (type === 'dislike') return handleDislike();
    if (type === 'favourite') return handleFavourite();
  };

  // Comment submit handler placeholder
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // your comment post logic here
    if (newComment.trim()) {
      // Example: add new comment locally
      const newC = {
        id: Math.random().toString(36).slice(2),
        content: newComment,
        createdAt: new Date().toISOString(),
        user: { name: 'You' },
      };
      setComments([newC, ...comments]);
      setNewComment('');
      if (textareaRef.current) textareaRef.current.blur();
    }
  };

  return (
    <div className="fixed inset-0 bg-white/50 flex items-start justify-center z-50 p-[5%]">
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

        {/* Reaction buttons */}
        <div className="flex space-x-6 text-sm text-gray-700 mb-8">
          {/* Like */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReaction('like');
            }}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              liked ? 'text-green-500 hover:text-green-400' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 -960 960 960"
            >
              <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
            </svg>
            <span>{currentLikeCount}</span>
          </button>

          {/* Dislike */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReaction('dislike');
            }}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              disliked ? 'text-red-500 hover:text-red-400' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 -960 960 960"
            >
              <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
            </svg>
            <span>{currentDislikeCount}</span>
          </button>

          {/* Favourite */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReaction('favourite');
            }}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              favourited ? 'text-yellow-500 hover:text-yellow-400' : 'text-gray-600 hover:text-gray-400'
            }`}
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
            <span>{currentFavouriteCount}</span>
          </button>
        </div>

        {/* ───────────────────────────────────────── */}
        {/* Comment form */}
        {/* ───────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="mb- p-3 rounded-lg space-y-2">
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
          <h4 className="text-lg font-semibold mb-4 text-gray-500">
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
