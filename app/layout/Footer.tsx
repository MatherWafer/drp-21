'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategory } from "../user/posts/CategoryContext";

export default function Footer() {

  type UserOption = {
    url: string;
    description: string;
  };

  const userOptions: UserOption[] = [
    { url: '/create', description: 'Make a Post' },
    { url: '/', description: 'Show Map' },
    { url: '/feed', description: 'Show Feed' },
  ];

  const pathname = usePathname();

  function UserOptionTab({ uo }: { uo: UserOption }) {
    const isActive = pathname === uo.url;

    return (
      <Link
        href={uo.url}
        className={`px-4 py-3 rounded-xl shadow-lg transition-all duration-300 transform flex items-center justify-center text-lg font-semibold w-48 text-center border
          ${isActive ? 'bg-teal-600 border-teal-400 scale-105' : 'bg-teal-800 hover:bg-teal-700 border-teal-700'} text-white`}
      >
        {uo.description}
      </Link>
    );
  }

  return (
    <div className="flex flex-nowrap justify-center gap-4 mb-4 w-pull px-4">
          {userOptions.map((uo) => (
            <UserOptionTab uo={uo} key={uo.description} />
          ))}
    </div>
  );
}