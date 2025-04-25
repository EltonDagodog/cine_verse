"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import axios from "axios";

interface User {
  username: string;
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-black text-white flex items-center justify-between p-4 sm:p-6 z-50">
      {/* Logo */}
      <h1 className="text-red-600 text-2xl sm:text-3xl font-bold">Undecided</h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        <Link href="/homepage" className="hover:text-red-500">Home</Link>
        <Link href="/movie_list" className="hover:text-red-500">Movies</Link>
        <Link href="/about" className="hover:text-red-500">About us</Link>
      </nav>

      {/* Right Section: Search, Profile, and Mobile Menu */}
      <div className="flex items-center space-x-2">
        {/* Search Bar and Button */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-24 md:w-48 bg-gray-800 text-white rounded-md pl-8 pr-3 py-1 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
            />
            <MagnifyingGlassIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white p-1 md:p-2 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            <MagnifyingGlassIcon className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </form>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" />
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <UserIcon
            className="h-6 w-6 cursor-pointer hover:text-red-500"
            onClick={handleUserClick}
          />
          {isLoggedIn && user && !loading && (
            <span
              className="hidden md:inline cursor-pointer hover:text-red-500"
              onClick={handleUserClick}
            >
              {user.username}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-black flex flex-col items-center space-y-4 py-4 md:hidden">
          <Link href="/homepage" className="hover:text-red-500" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/movie_list" className="hover:text-red-500" onClick={() => setMobileMenuOpen(false)}>Movies</Link>
          <Link href="/about" className="hover:text-red-500" onClick={() => setMobileMenuOpen(false)}>About us</Link>
        </nav>
      )}

      {/* User Dropdown */}
      {isLoggedIn && dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white text-black rounded-md shadow-lg overflow-hidden">
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
    </header>
  );
}