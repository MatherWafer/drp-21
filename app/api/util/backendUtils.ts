import { createClient } from "../../../utils/supabase/server"

export async function getUserId(){
    const supabase = await createClient()
    const user = await supabase.auth.getUser()
    const id = await user.data.user?.id
    return id
}

export async function withProfileId(data: object){
    const supabase = await createClient()
    const user = await supabase.auth.getUser()
    const profileId = await user.data.user?.id
    return {...data, profileId}
}