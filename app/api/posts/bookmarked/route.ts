import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserId, sortMapping } from '../../util/backendUtils';
import { FetchedPost, filterByLocation, postSelectOptions, transformPosts } from '../util/post_util';
import { PrismaPost } from '../feed/route';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - missing user ID' },
      { status: 401 }
    );
  }

  const filterPolygon = (req.headers.get('x-filter-roi') ?? '').toLowerCase() === 'true';
  const sortType = (req.headers.get('x-sort-type') ?? 'most_recent').toLowerCase();

  // Validate sortType against available options
  if (!['most_recent', 'most_liked', 'most_comments'].includes(sortType)) {
    return NextResponse.json(
      { error: 'Invalid sort type' },
      { status: 400 }
    );
  }

  let favourites = await prisma.favourite.findMany({
    where: {
      profileId: userId,
    },
    include: {
      post: postSelectOptions(userId), // Use postSelectOptions without spreading sortMapping here
    },
  });

  // Sort the posts after fetching based on sortType
  let posts: FetchedPost[] = favourites
    .map(fp => fp.post)
    .sort((a, b) => {
      switch (sortType) {
        case 'most_recent':
          return new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime();
        case 'most_liked':
          return (b._count?.Likes || 0) - (a._count?.Likes || 0);
        case 'most_comments':
          return (b._count?.Comments || 0) - (a._count?.Comments || 0);
        default:
          return 0;
      }
    }) as PrismaPost[];
  if (!filterPolygon) {
    return NextResponse.json({ posts: transformPosts(posts) });
  }

  posts = await filterByLocation(posts, userId, prisma);
  return NextResponse.json({ posts: transformPosts(posts) });
}