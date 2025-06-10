'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isProfile = pathname === "/user/profile";

  return (
    <div className="w-full flex justify-end px-4 py-2">
      <Link
        href="/user/profile"
        className={`p-2 rounded-full transition duration-300 border-2 ${
          isProfile
            ? 'bg-teal-600 border-teal-400 scale-105'
            : 'bg-teal-800 hover:bg-teal-700 border-teal-700'
        }`}
      >
        <img
          src="/person.svg"
          alt="Profile"
          className="w-6 h-6 filter invert brightness-0"
        />
      </Link>
    </div>
  );
}
