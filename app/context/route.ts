
// app/api/increment/route.ts
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const {name} = await req.json()
  const supabase = await createClient()
  const user = await supabase.auth.getUser()
  const id = user.data.user?.id
  prisma.profile.findFirst({
    select: {
        name:true
    },
    where:{
        id:id
    }

  })
  return NextResponse.json({data:name});
}


