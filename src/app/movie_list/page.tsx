"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import ReactStars from "react-stars";
import { FaSearch } from "react-icons/fa";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

type MovieType = {
  id: number;
  title: string;
  description: string;
  release_date: string;
  video: string;
  image: string;
  categories: { id: number; name: string }[];
  total_ratings: number;
  total_reactions: number;
  total_comments: number;
};

const MovieList = () => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}movie/api/movies/` ||
            "http://127.0.0.1:8000/movie/api/movies/"
        );
        setMovies(response.data);
      } catch (_err) { 
        setError("Failed to fetch movies");
        console.error("Error fetching movies:", _err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleWatchNow = (movieId: number) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      router.push(`/movies/${movieId}`);
    } else {
      alert("Please log in to watch the movie!");
      router.push("/signin");
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-white text-center mt-10">Loading movies...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="bg-[#0D0F14] min-h-screen">
      <Sidebar />
      <Navbar />

      {/* Search Bar */}
      <h2 className="text-2xl text-white font-bold text-center pt-22">Movie List</h2>
      <div className="flex justify-center pt-6">
        <div className="relative w-[300px]">
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full p-2 pl-8 text-white bg-[#1A1D24] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-2 top-2 text-gray-400 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-6 pl-14 pt-6">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#1A1D24] p-3 rounded-xl shadow-md transition-transform transform hover:scale-105"
            >
              <div className="relative w-full h-[180px]">
                <Image
                  src={movie.image}
                  alt={movie.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>

              <h3 className="text-white text-md font-semibold mt-2 truncate">{movie.title}</h3>
              <p className="text-gray-400 text-xs">{movie.release_date}</p>

              {/* Ratings */}
              <div className="mt-2">
                <ReactStars
                  count={5}
                  value={movie.total_ratings}
                  size={16}
                  edit={false}
                  color2={"#FFD700"}
                />
                <p className="text-gray-500 text-xs">
                  {movie.total_comments} comments | {movie.total_reactions} reactions
                </p>
              </div>

              {/* Watch Now Button */}
              <button
                onClick={() => handleWatchNow(movie.id)}
                className="mt-3 w-full bg-red-600 hover:bg-blue-600 text-white text-xs font-semibold py-1 rounded-md transition-all duration-300"
              >
                Watch Now
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-5">No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default MovieList;