"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { MovieType, MovieCard, LoadingSpinner } from "../components/moviecomponent";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function Search() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!API_URL || !query) {
        setError("Invalid search query or API URL.");
        setLoading(false);
        return;
      }
      try {
        // Attempt API search (adjust endpoint/parameters as needed)
        const response = await axios.get(`${API_URL}movie/api/movies/`, {
          params: { search: query }, // Change to 'q' or other param if required
        });
        const results = response.data;
        
        // If API returns unfiltered results, apply client-side filtering
        if (results.length > 0 && !results.some((movie: MovieType) => movie.title.toLowerCase().includes(query.toLowerCase()))) {
          const filteredMovies = results.filter((movie: MovieType) =>
            movie.title.toLowerCase().includes(query.toLowerCase())
          );
          setMovies(filteredMovies);
        } else {
          setMovies(results);
        }
      } catch (err) {
        setError("Failed to fetch search results: " + (err instanceof Error ? err.message : "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

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
      <Sidebar />
      <main className="pt-16 pl-16 md:pl-16">
        <section className="p-4 sm:p-8 md:p-12 pb-12 bg-[#10131a]">
          <h2 className="text-white text-xl sm:text-2xl mb-4 pt-4">
            Search Results for "{query || ""}"
          </h2>
          {loading && <LoadingSpinner />}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && movies.length === 0 && (
            <div className="text-center text-gray-400">No results found for "{query || ""}".</div>
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