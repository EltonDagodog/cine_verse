"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { MovieType, MovieCard, LoadingSpinner } from "../components/moviecomponent";
import Navbar from "../components/navbar";


// A separate component to handle useSearchParams with Suspense
function SearchContent() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        router.push("/homepage");
        return;
      }

      if (!API_URL) {
        setError("API URL is not configured.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}movie/api/movies/search/`, {
          params: { q: query },
        });
        setMovies(response.data);
      } catch (err) {
        setError(
          "Failed to fetch search results: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query, API_URL, router]);

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
    <main className="pt-16 pl-16 md:pl-16">
      <section className="p-4 sm:p-8 md:p-12 pb-12 bg-[#10131a]">
        <h2 className="text-white text-xl sm:text-2xl mb-4 pt-4">
          Search Results for '{query || ""}'
        </h2>
        {loading && <LoadingSpinner />}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center text-gray-400">
            No results found for '{query || ""}'.
          </div>
        )}
        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                apiUrl={API_URL}
                onWatchNow={handleWatchNow}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function Search() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}