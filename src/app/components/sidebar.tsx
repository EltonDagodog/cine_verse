"use client";

import { useState } from "react";
import { HomeIcon, FilmIcon, BookmarkIcon, Bars3Icon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="fixed left-4 top-20 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Bars3Icon className="h-6 w-6 text-white" />
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 bg-black shadow-lg flex flex-col items-center py-6 space-y-6 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <HomeIcon
          className="h-6 w-6 text-white cursor-pointer hover:text-red-500 p-1"
          onClick={() => {
            router.push("/homepage");
            setIsSidebarOpen(false);
          }}
          title="Home"
        />
        <FilmIcon
          className="h-6 w-6 text-white cursor-pointer hover:text-red-500 p-1"
          onClick={() => {
            router.push("/");
            setIsSidebarOpen(false);
          }}
          title="Movies"
        />
        <BookmarkIcon
          className="h-6 w-6 text-white cursor-pointer hover:text-red-500 p-1"
          onClick={() => {
            router.push("/my_favorites");
            setIsSidebarOpen(false);
          }}
          title="Favorites"
        />
      </aside>
    </>
  );
}