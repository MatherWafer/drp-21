import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '../../util/backendUtils';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.pathname.split('/').pop();

  if (!postId) {
    return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        creator: true,
        Favourites: true,
        Likes: true,
        Dislikes: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const userId = await getUserId(); // returns the current user's profileId as a string (UUID)

    return NextResponse.json({
      id: post.id,
      profileId: post.profileId,
      title: post.title,
      description: post.description,
      category: post.category,
      locationText: post.locationText,
      latitude: post.latitude,
      longitude: post.longitude,
      imageUrl: post.imageUrl ?? null,
      creator: {
        id: post.creator.id,
        name: post.creator.name,
      },
      favouriteCount: post.Favourites.length,
      likeCount: post.Likes.length,
      dislikeCount: post.Dislikes.length,
      hasFavourited: userId ? post.Favourites.some(f => f.profileId === userId) : false,
      hasLiked: userId ? post.Likes.some(l => l.profileId === userId) : false,
      hasDisliked: userId ? post.Dislikes.some(d => d.profileId === userId) : false,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
