import { Post, Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { SortType, getUserId, sortMapping } from '../../util/backendUtils';
import { createClient } from '../../../../utils/supabase/server';
import { transformPosts } from '../util/post_util';

const prisma = new PrismaClient();

export type PrismaPost = Post & {
  creator: { id: string; name: string };
  _count: { Likes: number; Dislikes: number; Favourites: number; Comments: number };
  Likes: { postId: string }[];
  Comments: { postId: string }[];
  Dislikes: { postId: string }[];
  Favourites: { postId: string }[];
};

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - missing user ID' },
        { status: 401 }
      );
    }

    const filterPolygon = (req.headers.get('x-filter-roi') ?? '').toLowerCase() === 'true';
    const sortType = (req.nextUrl.searchParams.get('sortType') ?? 'most_recent').toLowerCase() as SortType;

    // Validate sortType
    if (!['most_recent', 'most_liked', 'most_comments'].includes(sortType)) {
      return NextResponse.json(
        { error: 'Invalid sort type' },
        { status: 400 }
      );
    }

    // Extract pagination parameters

    // Use raw SQL orderBy
    const orderBy = sortMapping[sortType]?.orderBy;
    if (!orderBy) {
      return NextResponse.json(
        { error: 'Invalid sort mapping' },
        { status: 400 }
      );
    }



    // Construct the query using Prisma.sql with explicit UUID casting
    const posts = await prisma.$queryRaw<PrismaPost[]>(Prisma.sql`
      SELECT 
        p.*,
        json_build_object('id', c.id, 'name', c.name) AS creator,
        json_build_object(
          'Likes', (SELECT COUNT(*) FROM "Like" l WHERE l."postId" = p.id),
          'Dislikes', (SELECT COUNT(*) FROM "Dislike" d WHERE d."postId" = p.id),
          'Favourites', (SELECT COUNT(*) FROM "Favourite" f WHERE f."postId" = p.id),
          'Comments', (SELECT COUNT(*) FROM "Comment" cm WHERE cm."postId" = p.id)
        ) AS _count,
        COALESCE(
          (SELECT json_agg(json_build_object('postId', l."postId"))
           FROM "Like" l
           WHERE l."postId" = p.id
             AND l."profileId" = ${userId}::uuid),
          '[]'
        ) AS "Likes",
        COALESCE(
          (SELECT json_agg(json_build_object('postId', cm."postId"))
           FROM "Comment" cm
           WHERE cm."postId" = p.id
             AND cm."profileId" = ${userId}::uuid),
          '[]'
        ) AS "Comments",
        COALESCE(
          (SELECT json_agg(json_build_object('postId', d."postId"))
           FROM "Dislike" d
           WHERE d."postId" = p.id
             AND d."profileId" = ${userId}::uuid),
          '[]'
        ) AS "Dislikes",
        COALESCE(
          (SELECT json_agg(json_build_object('postId', f."postId"))
           FROM "Favourite" f
           WHERE f."postId" = p.id
             AND f."profileId" = ${userId}::uuid),
          '[]'
        ) AS "Favourites"
      FROM "Post" p
      INNER JOIN "Profile" c ON p."profileId" = c.id
      ${filterPolygon
        ? Prisma.sql`
            INNER JOIN "InterestRegion" ir ON ST_Contains(
              ir.region,
              ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326)
            )
            WHERE ir."profileId" = ${userId}::uuid
          `
        : Prisma.sql`WHERE 1=1`
      }
      ORDER BY ${Prisma.raw(orderBy)} DESC
    `);

    return NextResponse.json({ posts: transformPosts(posts) });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}