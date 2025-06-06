// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { getUserId } from '../../util/backendUtils';
import { latLngEquals,
 } from '@vis.gl/react-google-maps';
import { LatLng, isInside } from '../../util/geoHelpers';

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

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      profileId: true,
      title: true,
      latitude: true,
      longitude: true,
      category: true,
      description: true,
      creator: true,
      locationText:true,
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

  const region = ((await prisma.interestRegion.findFirst({
    where: {
      profileId: userId
    },
    select: {
      region: true
    }
  }))?.region ?? []) as LatLng[]

  if (region.length === 0 || !filterPolygon) {
    return NextResponse.json({ posts: transformedPosts });
  }
  
  const filtered = transformedPosts.filter(p =>
    isInside({lat:p.latitude, lng:p.longitude},region)
  );

  return NextResponse.json({ posts: filtered });
}