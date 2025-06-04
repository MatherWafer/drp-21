import Link from "next/link";
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

  function UserOptionTab({ uo }: { uo: UserOption }) {
    return (
      <Link
        href={uo.url}
        className="bg-teal-800 hover:bg-teal-700 text-white px-4 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg font-semibold w-48 text-center border border-teal-700 flex-shrink text-center"
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