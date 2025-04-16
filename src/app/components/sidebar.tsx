"use client";
import { HomeIcon, FilmIcon, BookmarkIcon } from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation";



export default function Sidebar() {
  const router = useRouter();
  return (
       <aside className="fixed left-0 top-50 h-full w-12 bg-transparent shadow-lg flex flex-col items-center py-6 space-y-6">
      <HomeIcon className="h-6 w-6 text-white cursor-pointer hover:text-red-500" onClick={() => router.push("/homepage")} />
      <FilmIcon className="h-6 w-6 text-white cursor-pointer hover:text-red-500" onClick={() => router.push("/")} />
      <BookmarkIcon className="h-6 w-6 text-white cursor-pointer hover:text-red-500" onClick={() => router.push("/my_favorites")} />
    </aside>
  );
}
