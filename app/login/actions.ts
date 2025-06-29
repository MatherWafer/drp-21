"use server"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import { useUser } from '../context/userContext'


export async function login(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    redirect('/login')
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data: SignUpWithPasswordCredentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data:{
        name: formData.get('email') as string
      }
    }
  }

  const res = await supabase.auth.signUp(data)
  const error = res.error
  const user = res.data.user
  if (error) {
    redirect('/login')
  }
  const prisma = new PrismaClient()
  if(user) {
    try {
      await prisma.profile.create({
        data: {
          id: user.id, // Use auth user's ID
          name: formData.get('name') as string,
        }
      })
    } catch (prismaError) {
      console.log(prismaError)
      // Optional: delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(user.id)
      console.log("Failed")
    }
  }

  revalidatePath('/', 'layout')
  redirect('/select-roi')
}