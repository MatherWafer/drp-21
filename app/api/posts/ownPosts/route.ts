// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
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

  const posts = await prisma.post.findMany({
    where: {
      profileId: userId
    },
    select: {
      id: true,
      profileId: true,
      title: true,
      latitude: true,
      longitude: true,
      locationText:true,
      category: true,
      description: true,
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
  });
  const transformedPosts = posts.map(post => ({
    ...post,
    likeCount: post._count.Likes,
    hasLiked: post.Likes.length > 0,
    favouriteCount: post._count.Favourites,
    hasFavourited: post.Favourites.length > 0
  }));

  return NextResponse.json({ posts: transformedPosts });
}