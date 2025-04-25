"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Navbar from "../components/navbar";
import { InformationCircleIcon, PlayIcon } from "@heroicons/react/16/solid";
import { MovieType, MovieCard, LoadingSpinner } from "../components/moviecomponent";
import { useRouter } from "next/navigation";

export default function Home() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      {/* <Sidebar /> */}
      <main className="pt-16 pl-16 md:pl-16">
        {/* Hero Section */}
        {loading && <LoadingSpinner />}
        {!loading && movies.length > 0 && (
          <div className="relative w-full h-[60vh] sm:h-[80vh]">
            <Image
              src={movies[0].image.startsWith("http") ? movies[0].image : `${API_URL}${movies[0].image}`}
              alt={movies[0].title}
              layout="fill"
              objectFit="cover"
              className="opacity-70 animate-fade-in"
            />
            <div className="absolute inset-0 flex flex-col justify-center p-4 sm:p-8 md:p-12 bg-black/60">
              <h1 className="text-gray-300 text-3xl sm:text-4xl md:text-5xl font-bold animate-slide-in-left">
                {movies[0].title}
              </h1>
              <p className="mt-2 text-sm sm:text-base w-full sm:w-3/4 md:w-2/3 text-gray-400 animate-slide-in-left animation-delay-200">
                {movies[0].description}
              </p>
              <div className="mt-4 flex gap-4 animate-slide-in-left animation-delay-400">
                <button
                  onClick={() => handleWatchNow(movies[0].id)}
                  className="bg-white text-black px-4 sm:px-6 py-2 flex items-center gap-2 rounded-md hover:scale-105 transition-transform duration-200"
                >
                  <PlayIcon className="h-5 w-5 sm:h-6 sm:w-6" /> Play
                </button>
                <button className="bg-gray-700 px-4 sm:px-6 py-2 flex items-center gap-2 rounded-md text-white hover:bg-gray-600 transition-colors duration-200">
                  <InformationCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" /> More Info
                </button>
              </div>
            </div>
          </div>
        )}
        {!loading && movies.length === 0 && !error && (
          <div className="text-center p-4 sm:p-8 md:p-12 text-gray-400">No movies available.</div>
        )}

        {/* Movies List */}
        <section className="p-4 sm:p-8 md:p-12 pb-12 bg-[#10131a]">
          <h2 className="text-white text-xl sm:text-2xl mb-4 pt-4">Popular Now</h2>
          {loading && <LoadingSpinner />}
          {error && (
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchMovies();
                }}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && movies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  apiUrl={API_URL || ""}
                  onWatchNow={handleWatchNow}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}