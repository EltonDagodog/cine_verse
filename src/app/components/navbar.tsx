"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { UserIcon } from "@heroicons/react/16/solid";
import axios from "axios";

interface User {
  username: string;
 
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (_error) { 
        
        console.error("Error fetching user details:", _error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleUserClick = () => {
    if (isLoggedIn) {
      setDropdownOpen(!dropdownOpen);
    } else {
      alert("Please login first");
      router.push("/signin");
    }
  };

  return (
    <header className="fixed top-0 w-full bg-black text-white flex items-center justify-between p-4 z-1000">
      <h1 className="text-red-600 text-3xl font-bold">Undecided</h1>
      <nav className="hidden md:flex space-x-6">
        <Link href="/homepage" className="hover:text-red-500">Home</Link> 
        <Link href="/movie_list" className="hover:text-red-500">Movies</Link> 
        <Link href="/about" className="hover:text-red-500">About us</Link> 
      </nav>
      <div className="relative flex items-center space-x-2">
        <UserIcon
          className="h-6 w-6 cursor-pointer hover:text-red-500"
          onClick={handleUserClick}
        />
        {isLoggedIn && user && !loading && (
          <span
            className="cursor-pointer hover:text-red-500"
            onClick={handleUserClick}
          >
            {user.username}
          </span>
        )}
        {isLoggedIn && dropdownOpen && (
          <div className="absolute right-0 mt-40 w-40 bg-white text-black rounded-md shadow-lg overflow-hidden">
            <Link href="/user" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
            <Link href="/my_favorites" className="block px-4 py-2 hover:bg-gray-200">Favorites</Link>
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                setIsLoggedIn(false);
                setUser(null);
                router.push("/signin");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}