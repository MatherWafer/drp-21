import { Post, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { SortType, getUserId, sortMapping } from '../../util/backendUtils';
import { latLngEquals, } from '@vis.gl/react-google-maps';
import { LatLng, isInside } from '../../util/geoHelpers';
import { FetchedPost, filterByLocation, postSelectOptions, transformPosts } from '../util/post_util';

const prisma = new PrismaClient();
export type PrismaPost = Post & {
  creator: { id: string; name: string };
  _count: { Likes: number; Dislikes: number; Favourites: number; Comments: number };
  Likes: { postId: string }[];
  Comments: { postId: string }[];
  Dislikes: { postId: string }[];
  Favourites: { postId: string }[];
};
// New parameter in header, x-filter-polygon
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

  let posts = await prisma.post.findMany({
    ...postSelectOptions(userId),
    ...sortMapping[sortType as SortType],
  }) as PrismaPost[]
  if (!filterPolygon) {
    return NextResponse.json({ posts: transformPosts(posts) });
  }

  posts = await filterByLocation(posts, userId, prisma);
  return NextResponse.json({ posts: transformPosts(posts) });
}