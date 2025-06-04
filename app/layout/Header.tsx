import Link from "next/link";
import { useCategory } from "../user/posts/CategoryContext";

export default function Header() {

  type UserOption = {
    url: string;
    description: string;
  };

  const userOptions: UserOption[] = [
    { url: '/user/posts/ownPosts', description: 'My Posts' },
    { url: '/user/posts/bookmarked', description: 'Bookmarked' },
  ];

  function UserOptionTab({ uo }: { uo: UserOption }) {
    return (
      <Link
        href={uo.url} passHref
        className="bg-teal-800 hover:bg-teal-700 text-white px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg font-semibold w-48 text-center border border-teal-700"
      >
        {uo.description}
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 mb-4 pt-4">
          {userOptions.map((uo) => (
            <UserOptionTab uo={uo} key={uo.url} />
          ))}
    </div>
  );
}