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
  

    
  export type ROIRepsonse  = {
    name: string | null;
    region: JsonValue;
}