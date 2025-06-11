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
  const post = await prisma.interestRegion.create({
    data
  });

  return NextResponse.json({ post }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  try {
    const reqData = await req.json();
    const { id } = reqData; // ID of the region to delete
    if (!id) {
      return new NextResponse(JSON.stringify({ error: 'Missing region id' }), { status: 400 });
    }

    const deleted = await prisma.interestRegion.delete({
      where: {
        id: id,             // match by region id
      },
    });

    return new NextResponse(JSON.stringify({ success: true, deleted }), { status: 200 });

  } catch (err: any) {
    console.error('Delete region error:', err);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete region' }), { status: 500 });
  }
}