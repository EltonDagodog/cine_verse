"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  video: string;
}

const MyFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("You need to login first")
        router.push("/signin")
    }
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/movies/favorites/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        setFavorites(response.data);
      } catch (error) {
        
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
    <Sidebar />
    <Navbar />
      <h1 className="text-3xl pt-20 pl-20  font-bold mb-6">My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pr-20 pl-20 gap-6">
        {favorites.length > 0 ? (
          favorites.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition cursor-pointer"
              onClick={() => router.push(`/movies/${movie.id}`)}
            >
              <h2 className="text-xl font-bold">{movie.title}</h2>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
              <video
                controls
                className="w-full rounded-lg mt-4"
              >
                <source
                  src={movie.video.startsWith("http") ? movie.video : `http://127.0.0.1:8000${movie.video}`}
                  type="video/mp4"
                />
              </video>
              <div className="flex items-center mt-2 text-red-500">
                <FaHeart className="mr-2 text-xl" /> Liked
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No liked movies yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;
