'use client';

import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PrismaClient } from '@prisma/client';

const UserContext = createContext<
{
  displayName: string | null,
  loadProfile:  (() => Promise<void> )| null
}
>({
  displayName: null,
  loadProfile: null
});

const loadProfile = async (setDisplayName: Dispatch<SetStateAction<string | null>>) => {
  console.log("Starting to load!")
  const supabase = createClientComponentClient();
  const data = await supabase.auth.getUser();
  const session = data.data
  if (!session) return;
  const res = await fetch("/api/context", { method: "GET" });
  const body = await res.json()
  console.log(body)
  if(res){
    setDisplayName(body.name);
  }
}
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [displayName, setDisplayName] = useState<string | null>(null);
  useEffect(() => {
    console.log("Starting to load!")
    loadProfile(setDisplayName);
  }, []);

  return (
    <UserContext.Provider value={{ displayName, loadProfile:() => loadProfile(setDisplayName)}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
