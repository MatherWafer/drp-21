// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
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
  let posts:FetchedPost[] = await prisma.post.findMany({
    ...postSelectOptions(userId),
    where: {
      profileId: userId
    }
  }
  )
  return NextResponse.json({ posts: transformPosts(posts) });
}