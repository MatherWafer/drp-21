'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {

type UserOption = {
  url: string;
  icon: string; // path to icon
  description: string;
};

const userOptions: UserOption[] = [
  { url: '/feed', icon: '/home.svg', description: 'Feed'},
  { url: '/', icon: '/pin.svg', description: 'Map View'},
  { url: '/create', icon: '/loudspeaker.svg', description: 'Create Post' },
];

const pathname = usePathname();

function UserOptionTab({ uo }: { uo: UserOption }) {
  const isActive = pathname === uo.url;

  return (
    <Link
      href={uo.url}
      className={`py-2 shadow-lg transition-all duration-300 transform flex items-center justify-center text-lg font-semibold w-full text-center border
        ${isActive ? 'bg-teal-600 border-teal-500 scale-105' : 'bg-teal-800 hover:bg-teal-700 border-teal-700'} text-white`}
    >
      <img
        src={uo.icon}
        alt=""
        className="hidden md:block w-6 h-6 filter invert brightness-0"
      />
      &nbsp; {uo.description}
    </Link>
  );
}

  return (
    <div className="flex flex-nowrap justify-center w-full rounded-lg">
          {userOptions.map((uo) => (
            <UserOptionTab uo={uo} key={uo.icon} />
          ))}
    </div>
  );
}