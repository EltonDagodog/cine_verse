"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import ReactStars from "react-stars";
import { FaComment, FaHeart } from "react-icons/fa";
import Sidebar from "@/app/components/sidebar";
import Navbar from "@/app/components/navbar";

type CommentType = {
  id: number;
  user: string;
  text: string;
  created_at: string;
};

type MovieType = {
  background_image: string; // Replaced 'any' with 'string'
  id: number;
  title: string;
  description: string;
  release_date: string;
  video: string;
  image: string;
  categories: { id: number; name: string }[];
  total_reviews: number;
  average_rating: number;
  total_comments: number;
};

interface Reviews {
  id: number;
  movie: number;
  user: string;
  rating: number;
  created_at: string;
}

const MovieDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hearted, setHearted] = useState(false);
  const [totalHearts, setTotalHearts] = useState(0);

  useEffect(() => {
    const fetchReactions = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${id}/reactions/` ||
            `http://127.0.0.1:8000/api/movies/${id}/reactions/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setHearted(response.data.hearted);
        setTotalHearts(response.data.total_hearts);
      } catch (_err) {
        console.error("Error fetching reactions:", _err);
      }
    };

    fetchReactions();
  }, [id]);

  const handleToggleHeart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You must be logged in to react.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${id}/react/` ||
          `http://127.0.0.1:8000/api/movies/${id}/react/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHearted(response.data.hearted);
      setTotalHearts(response.data.hearted ? totalHearts + 1 : totalHearts - 1);
    } catch (_err) {
      console.error("Failed to toggle heart reaction:", _err);
      alert("Failed to react to movie.");
    }
  };

  useEffect(() => {
    const fetchRatings = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("No token or username found. Please log in.");
        return;
      }

      try {
        const response = await axios.get<Reviews[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ratings/${id}/` ||
            `http://127.0.0.1:8000/api/ratings/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Removed unused 'ratings' state
        const userRating = response.data.find((r) => r.user);
        if (userRating) {
          setRating(userRating.rating);
        }
      } catch (_err) { // Line 122: Renamed 'err' to '_err'
        setError("Failed to fetch ratings. Please check your token.");
      }
    };

    fetchRatings();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/movie/api/movies/${id}/` ||
            `http://127.0.0.1:8000/movie/api/movies/${id}/`
        );
        setMovie(response.data);
      } catch (_err) { // Line 141: Renamed 'err' to '_err'
        setError("Failed to fetch movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    if (!id || !showComments) return;

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${id}/comments/` ||
            `http://127.0.0.1:8000/api/movies/${id}/comments/`
        );
        setComments(response.data);
      } catch (_err) {
        console.error("Error fetching comments:", _err);
      }
    };

    fetchComments();
  }, [id, showComments]);

  // Submit a rating
  const handleRating = async (newRating: number) => {
    const movieId = Number(id);
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You must be logged in to rate this movie.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/` || `http://127.0.0.1:8000/api/reviews/`,
        { movie: movieId, rating: newRating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRating(newRating);
      setMovie((prev) => prev && { ...prev, average_rating: newRating });
    } catch (_err) {
      console.error("Failed to submit rating:", _err);
      alert("Failed to submit rating. Please try again.");
    }
  };

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("You must be logged in to comment.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/create/` ||
          `http://127.0.0.1:8000/api/comments/create/`,
        { text: newComment, movie: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setComments((prev) => [response.data, ...prev]);
      setNewComment("");
    } catch (_err) {
      console.error("Failed to add comment:", _err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading movie details...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>Movie not found</p>;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center z-0"
      style={{ backgroundImage: `url(${movie.image})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="z-10 relative max-w-4xl mx-auto p-6 text-white shadow-xl rounded-lg border border-gray-800">
        <Sidebar />
        <Navbar />
        <h2 className="text-4xl font-bold mb-2 text-red-500 pt-20">{movie.title}</h2>
        <p className="text-lg text-gray-300 mb-4">{movie.description}</p>
        <p className="text-gray-500">Released on: {movie.release_date}</p>

        <div className="mt-6 rounded-lg overflow-hidden border-2 border-red-500">
          <video controls className="w-full rounded-lg mt-4">
            <source
              src={movie.video.startsWith("http") ? movie.video : `${process.env.NEXT_PUBLIC_API_URL}${movie.video}` || `http://127.0.0.1:8000${movie.video}`}
              type="video/mp4"
            />
          </video>
        </div>

        {/* Rating & Actions */}
        <div className="flex items-center mt-6 space-x-6">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-300 mr-2">Rate:</span>
            <ReactStars
              count={5}
              value={rating}
              size={24}
              edit={true}
              color2="#ffcc00"
              onChange={handleRating}
            />
            <span className="ml-2 text-gray-300 font-semibold">
              {rating ? Number(rating).toFixed(1) : "0.0"}
            </span>
          </div>
          <button
            className="flex items-center text-gray-300 hover:text-red-500 font-semibold focus:outline-none"
            onClick={handleToggleHeart}
          >
            <FaHeart className={`mr-2 text-2xl ${hearted ? "text-red-500" : "text-gray-500"}`} />
            <span>{totalHearts}</span>
          </button>
          <button
            className="flex items-center text-gray-300 hover:text-blue-400 font-semibold focus:outline-none"
            onClick={() => setShowComments(!showComments)}
          >
            <FaComment className="mr-2 text-xl" />
            <span>{movie.total_comments} Comments</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-gray-900">
            <h3 className="text-2xl font-bold text-red-500">Comments</h3>
            <div className="max-h-60 overflow-y-auto mt-2 space-y-3">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 border-b border-gray-700 bg-gray-800 rounded-md"
                  >
                    <p className="text-sm font-semibold text-gray-400">{comment.user}</p>
                    <p className="text-gray-200">{comment.text}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
            <div className="mt-4">
              <textarea
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-red-500"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                onClick={handleAddComment}
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add Comment"}
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;