import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '../util/backendUtils';
import { geocodeLocation } from '../util/geoHelpers';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { latitude, longitude } = data;
    const userId = await getUserId()


    if (typeof latitude !== 'number' || typeof longitude !== 'number' || 
        latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    const location = await geocodeLocation(latitude,longitude)
    const postData = {
      ...data,
      profileId: userId,
      locationText:location, 
    };

    const post = await prisma.post.create({ data: postData });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); 
  }
}