// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserId, withProfileId } from '../util/backendUtils';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const reqData = await req.json();
  const data = await withProfileId(reqData);
  
  // Assuming 'profileId' is the unique identifier for the interest region
  // Adjust this based on your actual unique constraint
  const post = await prisma.interestRegion.upsert({
    where: {
      profileId: data.profileId // This should match your unique constraint
    },
    create: data,
    update: data
  });

  return NextResponse.json({ post }, { status: 200 });
}