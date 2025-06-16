import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { LatLng, isInside } from "../../util/geoHelpers";
import { NextResponse } from "next/server";

export type FetchedPost = {
  id: string;
  profileId: string;
  title: string;
  latitude: number;
  longitude: number;
  locationText: string;
  category: string;
  description: string;
  postedOn: Date;
  imageUrl?: string | null;
  Favourites: {
      postId: string;
  }[];
  Likes: {
      postId: string;
  }[];
  Dislikes: {
      postId: string;
  }[];
  creator: {
      
  };
  _count: {
      Likes: number,
      Dislikes: number,
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
        postedOn: true,
        creator: true,
        imageUrl: true,
        _count: {
          select: {
            Likes: true,
            Dislikes: true,
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
        Dislikes: {
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
    dislikeCount: post._count.Dislikes,
    hasDisliked: post.Dislikes.length > 0,
    favouriteCount: post._count.Favourites,
    hasFavourited: post.Favourites.length > 0
  }));


export const filterByLocation = async (posts:FetchedPost[], userId: string, prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  const regions = ((await prisma.interestRegion.findMany({
    where: {
      profileId: userId
    },
    select: {
      region: true
  }}))?.map(r => r.region) ?? []) as LatLng[][]

  if (regions.length === 0 ) {
    return posts
  }
  return posts.filter(({ latitude, longitude }) =>
    regions.some((region) =>
      isInside({ lat: latitude, lng: longitude }, region)
    )
  );
}