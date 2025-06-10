import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { getUserId } from '../util/backendUtils';
import { JsonValue } from '@prisma/client/runtime/client';
const prisma = new PrismaClient()
export async function GET(req: NextRequest) {
  const id = await getUserId()
  console.log("ID: %s", id)
  const res = await prisma.profile.findFirst({
    select: {
        name:true,
        InterestRegions: {
          select: {
            region: true,
            name: true
          }
        }
    },
    where:{
        id:id
    }
  })
  if( res != null) {
    return NextResponse.json({name:res.name, interestRegion: res.InterestRegions});
  }
}


