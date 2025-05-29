// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - missing user ID' },
      { status: 401 }
    );
  }

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      profileId: true,
      title: true,
      location: true,
      description: true,
      creator: true,
      _count: {
        select: {
          Likes: true
        }
      },
      Likes: {
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
    hasLiked: post.Likes.length > 0 // True if user has liked this post
  }));

  return NextResponse.json({ posts: transformedPosts });
}