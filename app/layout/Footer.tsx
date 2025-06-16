'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  type UserOption = {
    url: string;
    icon: string; // path to icon
    description: string; // Full description for alt text
    label: string; // One-word label for display
  };

  const userOptions: UserOption[] = [
    { url: '/feed', icon: '/home.svg', description: 'Feed', label: 'Feed' },
    { url: '/', icon: '/pin.svg', description: 'Map View', label: 'Map' },
    { url: '/create', icon: '/loudspeaker.svg', description: 'Create Post', label: 'Create' },
  ];

  const pathname = usePathname();

  function UserOptionTab({ uo }: { uo: UserOption }) {
    const isActive = pathname === uo.url;

    return (
      <Link
        href={uo.url}
        className={`flex flex-col items-center justify-center rounded-none transition-all duration-200 transform flex-1
          ${isActive
            ? 'bg-teal-600/90 text-white scale-105 shadow-sm border-y border-teal-500/50'
            : 'bg-teal-800/70 text-gray-100 hover:bg-teal-700/80 hover:shadow-sm border-y border-teal-900/30'
          } backdrop-blur-sm`}
        aria-label={uo.description}
      >
        <img
          src={uo.icon}
          alt={`${uo.description} icon`}
          className="w-5 h-5 mb-1 filter invert brightness-0"
        />
        <span className="text-xs font-medium">{uo.label}</span>
      </Link>
    );
  }

  return (
    <div className="flex w-full bg-teal-900/20 backdrop-blur-md shadow-md">
      <div className="flex w-full">
        {userOptions.map((uo) => (
          <UserOptionTab uo={uo} key={uo.icon} />
        ))}
      </div>
    </div>
  );
}