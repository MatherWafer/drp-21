import { useFiltered } from "./FilterContext";
import PostOverview, { PostInfo } from "./PostOverview";

export default function PostStream(props:{
  posts: PostInfo[],
  onPostClick?: (post: PostInfo) => void;
  }) {
  const { category } = useFiltered();
    return <div className="flex flex-col items-center w-full">
      <div className="max-w-2xl w-full">
        {props.posts && props.posts
        
          .filter((p) => (category == "None" || p.category == category))
          .map((pi) =>
          (
            <div key={pi.id} onClick={() => props.onPostClick?.(pi)} className="cursor-pointer">
              <PostOverview post={pi} />
          </div>
          )
        )}
      </div>
    </div>;
  }