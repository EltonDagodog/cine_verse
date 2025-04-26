"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import ReactStars from "react-stars";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { MovieType, LoadingSpinner } from "../components/moviecomponent";
import Navbar from "../components/navbar";


const MovieList = () => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}movie/api/movies/`);
        setMovies(response.data);
      } catch (err) {
        setError("Failed to fetch movies: " + (err instanceof Error ? err.message : "Unknown error"));
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [API_URL]); 
  const handleWatchNow = (movieId: number) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push(`/movies/${movieId}`);
    } else {
      alert("Please log in to watch the movie!");
      router.push("/signin");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update searchQuery state is already handled by onChange
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16 pl-4 md:pl-4">
        {/* Header and Search Bar */}
        <section className="p-4 sm:p-8 md:p-12 pb-12 bg-[#10131a]">
          <h2 className="text-white text-xl sm:text-2xl font-bold text-center mb-6">
            Movie List
          </h2>

          {/* Search Bar with Button */}
          <form onSubmit={handleSearch} className="flex justify-center mb-8">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
              <input
                type="text"
                placeholder="Search movies..."
                className="w-full p-2 pl-8 pr-3 bg-gray-800 text-white rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="ml-2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </form>

          {/* Movie Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-[#181b23] p-4 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-fade-in"
                    style={{ animationDelay: `${movie.id * 100}ms` }}
                  >
                    <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px]">
                      <Image
                        src={movie.image.startsWith("http") ? movie.image : `${API_URL}${movie.image}`}
                        alt={movie.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-white mt-2 text-center text-base sm:text-lg font-semibold truncate">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {movie.release_date}
                    </p>
                    <div className="mt-2 w-full text-center">
                      <p className="text-gray-300 text-xs sm:text-sm font-bold">
                        Total Ratings
                      </p>
                      <div className="flex justify-center items-center mt-1">
                        <ReactStars
                          count={5}
                          value={movie.total_ratings}
                          size={16}
                          edit={false}
                          color2="#ffd700"
                        />
                        <span className="ml-2 text-gray-300 font-semibold text-xs sm:text-sm leading-none">
                          {typeof movie.total_ratings === "number"
                            ? movie.total_ratings.toFixed(1)
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">
                        {movie.total_comments} comments · {movie.total_reactions}{" "}
                        reactions
                      </p>
                    </div>
                    <button
                      onClick={() => handleWatchNow(movie.id)}
                      className="mt-4 w-full bg-red-600 text-white py-2 text-sm sm:text-base font-bold rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200"
                    >
                      Watch Now
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 col-span-full">
                  No movies found.
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MovieList;