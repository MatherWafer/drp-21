'use client';

import { useCategory } from "../user/posts/CategoryContext";
import { usePathname } from 'next/navigation';
import CategoryDropdown from "../user/posts/CategoryDropdown";

export default function Selector() {
  const { category, setCategory } = useCategory();
  const pathname = usePathname();

  // If URL contains 'create', render nothing (empty div)
  if (pathname.includes('create')) {
    return <div></div>; // or return null; either is fine
  }

  // Otherwise, render your usual stuff
  return (
    <div className="bg-blue flex items-center justify-center w-full-center">
      <CategoryDropdown/>
    </div>
  );
}