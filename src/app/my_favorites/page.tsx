"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { MovieType, LoadingSpinner } from "../components/moviecomponent";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

const MyFavorites = () => {
  const [favorites, setFavorites] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You need to login first");
        router.push("/signin");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}api/movies/favorites/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(response.data);
      } catch (err) {
        setError("Failed to fetch favorites: " + (err instanceof Error ? err.message : "Unknown error"));
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [router]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-16 md:pl-16">
        <section className="p-4 sm:p-8 md:p-12 pb-12 bg-[#10131a]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            My Favorites
          </h1>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {favorites.length > 0 ? (
                favorites.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-[#181b23] p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${movie.id * 100}ms` }}
                    onClick={() => router.push(`/movies/${movie.id}`)}
                  >
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
                      {movie.title}
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm">{movie.release_date}</p>
                    <video controls className="w-full rounded-lg mt-4">
                      <source
                        src={
                          movie.video.startsWith("http")
                            ? movie.video
                            : `${API_URL}${movie.video}`
                        }
                        type="video/mp4"
                      />
                    </video>
                    <div className="flex items-center mt-2 text-red-500">
                      <FaHeart className="mr-2 text-lg sm:text-xl" />
                      <span className="text-sm sm:text-base">Liked</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 col-span-full">
                  No liked movies yet.
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyFavorites;