'use client';

import { usePathname } from 'next/navigation';
import CategoryDropdown from "../user/posts/CategoryDropdown";
import FilterToggle from "../user/posts/RegionToggle";
type SelectorProps = {
  className?: string;
};

export default function Selector({ className }: SelectorProps) {
  const pathname = usePathname();



  return (
  <div className={`bg-blue flex items-center gap-2 w-full ${className}`}>
    {!pathname.includes('ownPosts') && (
      <div className="flex-1 h-10">
        <FilterToggle />
      </div>
    )}
    <div className="flex-1 h-10">
      <CategoryDropdown />
    </div>
  </div>
  );
}