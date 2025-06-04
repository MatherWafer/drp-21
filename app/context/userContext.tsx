'use client';

import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PrismaClient } from '@prisma/client';
import { LatLng } from '../api/util/geoHelpers';

const UserContext = createContext<
{
  displayName: string | null,
  interestRegion: LatLng[]
  loadProfile:  (() => Promise<void> )| null
}
>({
  displayName: null,
  interestRegion: [],
  loadProfile: null
});

const loadProfile = async (setDisplayName: Dispatch<SetStateAction<string | null>>, 
  setInterestRegion: Dispatch<SetStateAction<LatLng[]>>
  ) => {
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
    body.interestRegion && setInterestRegion(body.interestRegion)
  }
}
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [interestRegion, setInterestRegion] = useState<LatLng[]>([])
  useEffect(() => {
    console.log("Starting to load!")
    loadProfile(setDisplayName, setInterestRegion);
  }, []);

  return (
    <UserContext.Provider value={{ displayName, interestRegion, loadProfile:() => loadProfile(setDisplayName, setInterestRegion)}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
