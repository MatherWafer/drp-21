'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PrismaClient } from '@prisma/client';

const UserContext = createContext<{ displayName: string | null }>({ displayName: null });
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  console.log("🛠️ UserProvider component rendered!");
  useEffect(() => {
    console.log("Starting to load!")
    const loadProfile = async () => {
      console.log("Starting to load!")
      const data = await supabase.auth.getUser();
      const session = data.data
      if (!session) return;
      const res = await fetch("/api/context", { method: "GET" });
      const body = await res.json()
      console.log(body)
      if(res){
        setDisplayName(body.name);
      }

    };
    loadProfile();
  }, []);

  return (
    <UserContext.Provider value={{ displayName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
