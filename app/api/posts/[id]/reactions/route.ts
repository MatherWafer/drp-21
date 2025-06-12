// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserId, withProfileId } from '../../../util/backendUtils';

const prisma = new PrismaClient();

const getReactionsForPost = async (postId: string, profileId: string) => {
  const [like, dislike, favourite] = await Promise.all([
    prisma.like.findUnique({ where: { postId_profileId: { postId, profileId } } }),
    prisma.dislike.findUnique({ where: { postId_profileId: { postId, profileId } } }),
    prisma.favourite.findUnique({ where: { postId_profileId: { postId, profileId } } }),
  ])

  return {
    liked: !!like,
    disliked: !!dislike,
    favourited: !!favourite,
  }
}
