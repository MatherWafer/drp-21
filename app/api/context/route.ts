import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { getUserId } from '../util/backendUtils';
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const id = await getUserId()
  console.log("ID: %s", id)
  const res = await prisma.profile.findFirst({
    select: {
        name:true
    },
    where:{
        id:id
    }

    
  })
  if( res != null) {
    return NextResponse.json({name:res.name});
  }
}


