import { JsonValue } from "@prisma/client/runtime/client"
import { createClient } from "../../../utils/supabase/server"

export async function getUserId(){
    const supabase = await createClient()
    const user = await supabase.auth.getUser()
    const id = await user.data.user?.id
    return id
}

// new: “T can be any object type; we’ll merge in `profileId: string`.”
export async function withProfileId<T extends object>(
    data: T
  ): Promise<T & { profileId: string }> {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
  
    if (user.data.user) {
      return { ...data, profileId: user.data.user.id };
    }
    return { ...data, profileId: "" };
  }
  

// backendUtils.ts
import { Prisma } from '@prisma/client';
import { LatLng } from "./geoHelpers"

export type SortType = 'most_recent' | 'most_liked' | 'most_comments';

export const sortMapping: Record<SortType, { orderBy: string }> = {
  most_recent: { orderBy: 'p."postedOn"' },
  most_liked: { orderBy: '(SELECT COUNT(*) FROM "Like" l WHERE l."postId" = p.id)' },
  most_comments: { orderBy: '(SELECT COUNT(*) FROM "Comment" cm WHERE cm."postId" = p.id)' },
};
  export type ROIResponse  = {
    regionJson: LatLng[]
    name: string | null;
    region: JsonValue;
    id: string
}