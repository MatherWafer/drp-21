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


export const filterByLocation = async (posts:FetchedPost[], userId: string, prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  const region = ((await prisma.interestRegion.findFirst({
    where: {
      profileId: userId
    },
    select: {
      region: true
  }}))?.region ?? []) as LatLng[]
  
  if (region.length === 0 ) {
    return posts
  }
  return posts.filter (
    ({latitude,longitude}) => 
    isInside({lat:latitude, lng:longitude},region));
}