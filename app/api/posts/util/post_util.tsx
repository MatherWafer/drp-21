
export type FetchedPost = {
  id: string;
  profileId: string;
  title: string;
  latitude: number;
  longitude: number;
  locationText: string;
  category: string;
  description: string;
  Favourites: {
      postId: string;
  }[];
  Likes: {
      postId: string;
  }[];
  creator: {
      
  };
  _count: {
      Likes: number,
      Favourites: number
  };
}

export const postSelectOptions = (userId:string) =>  ({
    select: {
        id: true,
        profileId: true,
        title: true,
        latitude: true,
        longitude: true,
        category: true,
        description: true,
        locationText: true,
        creator: true,
        _count: {
          select: {
            Likes: true,
            Favourites: true
          }
        },
        Likes: {
          where: {
            profileId: userId
          },
          select: {
            postId:true
          }
        },
        Favourites: {
          where: {
            profileId: userId
          },
          select: {
            postId:true
          }
        }
      }
})

export const transformPosts = (posts:FetchedPost[]) => posts.map(post => ({
    ...post,
    likeCount: post._count.Likes,
    hasLiked: post.Likes.length > 0,
    favouriteCount: post._count.Favourites,
    hasFavourited: post.Favourites.length > 0
  }));
