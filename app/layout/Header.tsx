'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  type UserOption = {
    url: string;
    description: string;
  };

  const userOptions: UserOption[] = [
    { url: '/user/posts/ownPosts', description: 'My Posts' },
    { url: '/user/posts/bookmarked', description: 'Bookmarked' },
    { url: '/select-roi', description: 'My profile' },
  ];

  const pathname = usePathname();

  function UserOptionTab({ uo }: { uo: UserOption }) {
    const isActive = pathname === uo.url;

    return (
      <Link
        href={uo.url}
        className={`px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 transform flex items-center justify-center text-lg font-semibold w-48 text-center border
          ${isActive ? 'bg-teal-600 border-teal-400 scale-105' : 'bg-teal-800 hover:bg-teal-700 border-teal-700'} text-white`}
      >
        {uo.description}
      </Link>
    );
  }

  return (
    <div className="flex flex-nowrap px-2 justify-center gap-2 mb-4 pt-4">
      {userOptions.map((uo) => (
        <UserOptionTab uo={uo} key={uo.url} />
      ))}
    </div>
  );
}
