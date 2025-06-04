import { useCategory } from "./CategoryContext";
import PostOverview, { PostInfo } from "./PostOverview";

export default function PostStream(props:{posts: PostInfo[]}) {
  const { category } = useCategory();
    return <div className="flex flex-col items-center w-full">
      <div className="max-w-2xl w-full">
        {props.posts && props.posts
        
          .filter((p) => (category == "None" || p.category == category))
          .map((pi) =>
          (
              <PostOverview key={pi.id as string} post={pi} />
          )
        )}
      </div>
    </div>;
  }