"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import { InformationCircleIcon, PlayIcon } from "@heroicons/react/16/solid";
import ReactStars from "react-stars";
import { useRouter } from "next/navigation";

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

export default function Home() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/movie/api/movies/` || "http://127.0.0.1:8000/movie/api/movies/");
        setMovies(response.data);
      } catch (_err) { 
         setError("failed to fetch movies." + (_err instanceof Error ? _err.message : ""));
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

  return (
    <div className="relative h-screen bg-black">
        <Navbar />
      <Sidebar />
 

      {/* Hero Section */}
      {movies.length > 0 && (
        <div className="relative w-full h-[80vh]">
          <Image
            src={movies[0].image}
            alt={movies[0].title}
            layout="fill"
            objectFit="cover"
            className="opacity-70"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-24 bg-black/60">
            <h1 className="text-gray-300 text-5xl font-bold">{movies[0].title}</h1>
            <p className="mt-2 text-lg w-2/3 text-gray-400">{movies[0].description}</p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleWatchNow(movies[0].id)}
                className="bg-white text-black px-6 py-2 flex items-center gap-2 rounded-md"
              >
                <PlayIcon className="h-6 w-6" /> Play
              </button>
              <button className="bg-gray-700 px-6 py-2 flex items-center gap-2 rounded-md text-white">
                <InformationCircleIcon className="h-6 w-6" /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movies List */}
      <section className="px-24 pb-12 bg-[#10131a]">
        <h2 className="text-white text-2xl mb-4 pt-4">Popular Now</h2>

        {loading && <p className="text-white">Loading movies...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="relative bg-[#181b23] p-4 rounded-lg shadow-lg flex flex-col items-center"
              >
                {/* Movie Image */}
                <Image
                  src={movie.image}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="rounded-lg shadow-lg transition-transform duration-300 transform group-hover:scale-105"
                />

                {/* Movie Title */}
                <p className="text-white mt-2 text-center text-lg font-semibold">{movie.title}</p>

                {/* Rating Section */}
                <div className="mt-3 w-full text-center">
                  <p className="text-gray-300 text-sm font-bold">Total Ratings</p>
                  <div className="flex justify-center items-center mt-1">
                    <ReactStars
                      count={5}
                      value={movie.total_ratings}
                      size={22}
                      edit={false}
                      color2={"#ffd700"}
                    />
                    <span className="ml-2 text-gray-300 font-semibold text-md">
                      {typeof movie.total_ratings === "number"
                        ? movie.total_ratings.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {movie.total_comments} comments · {movie.total_reactions} reactions
                  </p>
                </div>

                {/* Watch Now Button */}
                <button
                  onClick={() => handleWatchNow(movie.id)}
                  className="mt-4 w-full bg-red-600 text-white py-2 text-md font-bold rounded-md transition duration-200 hover:bg-red-700"
                >
                  Watch Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}