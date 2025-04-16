"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

interface Reviews {
  id: number;
  movie: number;
  user: string;
  rating: number;
  created_at: string;
}

export default function RatingsPage() {
  const [ratings, setRatings] = useState<Reviews[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      const token = localStorage.getItem("access_token");
      const movie_id = 2; // Static movie ID for now

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get<Reviews[]>(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
          }/api/ratings/${movie_id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRatings(response.data);
      } catch (_err) { 
        setError("Failed to fetch ratings. Please check your token.");
        console.error("Error fetching ratings:", _err);
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="bg-[#0D0F14] min-h-screen p-6">
      <Sidebar />
      <Navbar />
      <div className="max-w-2xl mx-auto pt-20">
        <h1 className="text-2xl text-white font-bold mb-4">
          User Ratings for Movie ID {2}
        </h1>

        {error && <p className="text-red-500">{error}</p>}

        <ul className="space-y-3">
          {ratings.length > 0 ? (
            ratings.map((rating) => (
              <li
                key={rating.id}
                className="p-4 border rounded-lg shadow bg-[#1A1D24] text-white"
              >
                <p>
                  <strong>Movie ID:</strong> {rating.movie}
                </p>
                <p>
                  <strong>User:</strong> {rating.user}
                </p>
                <p>
                  <strong>Rating:</strong> {rating.rating} ⭐
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(rating.created_at).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No ratings found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}