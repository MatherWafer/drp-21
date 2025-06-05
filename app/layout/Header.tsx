'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  type UserOption = {
    url: string;
    icon: string;
  };

  const userOptions: UserOption[] = [
    { url: '/user/posts/bookmarked', icon: '/bookmarks.svg' },
    { url: '/user/posts/ownPosts', icon: '/file.svg' },
    { url: '/select-roi', icon: '/person.svg' },
  ];

  const pathname = usePathname();

  function UserOptionTab({ uo }: { uo: UserOption }) {
    const isActive = pathname === uo.url;

    return (
      <Link
        href={uo.url}
        className={`py-2 shadow-lg transition-all duration-300 transform flex items-center justify-center text-lg font-semibold w-full text-center border
          ${isActive ? 'bg-teal-600 border-teal-400 scale-105' : 'bg-teal-800 hover:bg-teal-700 border-teal-700'} text-white`}
      >
        <img src={uo.icon} alt="" className="w-6 h-6 filter invert brightness-0" />
      </Link>
    );
  }

  return (
    <div className="flex flex-nowrap justify-center">
      {userOptions.map((uo) => (
        <UserOptionTab uo={uo} key={uo.url} />
      ))}
    </div>
  );
}