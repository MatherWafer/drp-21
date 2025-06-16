// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { SortType, getUserId, sortMapping } from '../../util/backendUtils';
import { FetchedPost, filterByLocation, postSelectOptions, transformPosts } from '../util/post_util';
import { PrismaPost } from '../feed/route';

const prisma = new PrismaClient();


/*
  const filterPolygon = (req.headers.get('x-filter-roi') ?? '').toLowerCase() === 'true';
  const sortType = (req.headers.get('x-sort-type') ?? 'most_recent').toLowerCase();

  // Validate sortType against available options
  if (!['most_recent', 'most_liked', 'most_comments'].includes(sortType)) {
    return NextResponse.json(
      { error: 'Invalid sort type' },
      { status: 400 }
    );
  }

  let posts: FetchedPost[] = await prisma.post.findMany({
    ...postSelectOptions(userId),
    ...sortMapping[sortType],
  });

*/
export async function GET(req: NextRequest) {
  const userId = await getUserId()
  const sortType = (req.headers.get('x-sort-type') ?? 'most_recent').toLowerCase();

  // Validate sortType against available options
  if (!['most_recent', 'most_liked', 'most_comments'].includes(sortType)) {
    return NextResponse.json(
      { error: 'Invalid sort type' },
      { status: 400 }
    );
  }
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - missing user ID' },
      { status: 401 }
    );
  }
  let posts = await prisma.post.findMany({
    ...postSelectOptions(userId),
    ...sortMapping[sortType as SortType],
    where: {
      profileId: userId
    }
  }
  ) as PrismaPost[]
  return NextResponse.json({ posts: transformPosts(posts) });
}