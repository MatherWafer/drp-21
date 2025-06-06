// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '../../util/backendUtils';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - missing user ID' },
      { status: 401 }
    );
  }

  const posts = await prisma.favourite.findMany({
    where: {
      profileId: userId
    },
    include: {
        post: {
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
      }
     }
    }
  )
  const transformedPosts = posts.map(post => ({
    ...post.post,
    likeCount: post.post._count.Likes,
    hasLiked: post.post.Likes.length > 0,
    favouriteCount: post.post._count.Favourites,
    hasFavourited: post.post.Favourites.length > 0
  }));

  return NextResponse.json({ posts: transformedPosts });
}