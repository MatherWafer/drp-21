// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '../../util/backendUtils';
import { FetchedPost, filterByLocation, postSelectOptions, transformPosts } from '../util/post_util';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - missing user ID' },
      { status: 401 }
    );
  }

  let posts: FetchedPost[] = (await prisma.favourite.findMany({
    where: {
      profileId: userId
    },
    include: {
        post: postSelectOptions(userId)
     }
    }
  )).map(fp => fp.post)
  const filterPolygon = (req.headers.get('x-filter-roi') ?? '').toLowerCase() === 'true';

  if(filterPolygon){
    posts = await filterByLocation(posts,userId,prisma)
  }
  return NextResponse.json({ posts: transformPosts(posts) });
}