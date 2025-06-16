'use client';

import CategoryDropdown from '../user/posts/CategoryDropdown';

type SelectorProps = {
  className?: string;
};

export default function Selector({ className }: SelectorProps) {
  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      <div>
        <label htmlFor="category" className="block text-xs font-semibold text-teal-100 mb-1">
          Category
        </label>
        <CategoryDropdown />
      </div>
    </div>
  );
}