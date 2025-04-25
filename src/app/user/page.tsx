"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";

interface User {
  first_name: string;
  middle_name: string;
  last_name: string;
  username: string;
  contact: string;
  address: string;
  gender: string;
  email: string;
}

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("You need to log in to view this page.");
        setLoading(false);
        router.push("/signin");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError(
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : "Failed to fetch user details."
        );
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [router, API_URL]); 
  
  return (
    <div className="min-h-screen bg-black relative">
      <Navbar />

      {/* Background with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop")`,
        }}
      ></div>

      {/* Main Content */}
      <main className="pt-16 pl-4 md:pl-4 flex justify-center items-center min-h-screen">
        {loading ? (
          <div className="relative z-10 text-center text-gray-400 text-lg sm:text-xl">
            Loading...
          </div>
        ) : error ? (
          <div className="relative z-10 text-center text-red-500 text-lg sm:text-xl">
            {error}
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 bg-[#181b23] rounded-lg shadow-xl animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-red-500 text-center mb-6 sm:mb-8">
              Account Details
            </h2>
            <div className="space-y-4 sm:space-y-5 text-sm sm:text-base md:text-lg">
              <p>
                <span className="text-gray-400 font-semibold">Name:</span>{" "}
                {user!.first_name} {user!.middle_name || ""} {user!.last_name}
              </p>
              <p>
                <span className="text-gray-400 font-semibold">Username:</span>{" "}
                {user!.username}
              </p>
              <p>
                <span className="text-gray-400 font-semibold">Contact:</span>{" "}
                {user!.contact}
              </p>
              <p>
                <span className="text-gray-400 font-semibold">Address:</span>{" "}
                {user!.address}
              </p>
              <p>
                <span className="text-gray-400 font-semibold">Gender:</span>{" "}
                {user!.gender}
              </p>
              <p>
                <span className="text-gray-400 font-semibold">Email:</span>{" "}
                {user!.email}
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                router.push("/signin");
              }}
              className="mt-6 sm:mt-8 w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-all duration-200 font-semibold text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}