"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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
        const movie_id = 2;  // Static movie ID for now
      
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }
      
        try {
          const response = await axios.get<Reviews[]>(
            `http://127.0.0.1:8000/api/ratings/${movie_id}/`,  // Corrected template string
            {
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            }
          );
          setRatings(response.data);
        } catch (err) {
          setError("Failed to fetch ratings. Please check your token.");
        }
      };

    fetchRatings();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Ratings for Movie ID 1</h1>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-3">
        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <li key={rating.id} className="p-4 border rounded-lg shadow">
              <p><strong>Movie ID:</strong> {rating.movie}</p>
              <p><strong>User:</strong> {rating.user}</p>
              <p><strong>Rating:</strong> {rating.rating} ⭐</p>
              <p className="text-gray-500 text-sm">{new Date(rating.created_at).toLocaleString()}</p>
            </li>
          ))
        ) : (
          <p>No ratings found.</p>
        )}
      </ul>
    </div>
  );
}
