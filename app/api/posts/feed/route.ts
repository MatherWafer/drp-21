// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { getUserId } from '../../util/backendUtils';
import { latLngEquals,
 } from '@vis.gl/react-google-maps';
import { LatLng, isInside } from '../../util/geoHelpers';
import { FetchedPost, postSelectOptions, transformPosts } from '../util/post_util';

const prisma = new PrismaClient();

// New parameter in header, x-filter-polygon
export async function GET(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - missing user ID' },
      { status: 401 }
    );
  }

  const filterPolygon = (req.headers.get('x-filter-roi') ?? '').toLowerCase() === 'true';

  let posts: FetchedPost[] = await prisma.post.findMany(postSelectOptions(userId));

  if (!filterPolygon) {
    return NextResponse.json({ posts: transformPosts(posts) });
  }

  const region = ((await prisma.interestRegion.findFirst({
    where: {
      profileId: userId
    },
    select: {
      region: true
  }}))?.region ?? []) as LatLng[]
  
  if (region.length === 0 ) {
    return NextResponse.json({ posts: transformPosts(posts) });
  }
  
  posts = posts.filter (
    ({latitude,longitude}) => 
    isInside({lat:latitude, lng:longitude},region));
  return NextResponse.json({ posts: transformPosts(posts) });
}