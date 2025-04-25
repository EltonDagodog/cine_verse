"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import ReactStars from "react-stars";
import { FaComment, FaHeart } from "react-icons/fa";
import { MovieType as MovieTypeImported, LoadingSpinner } from "../../components/moviecomponent";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

// Extend MovieType to include background_image and adjust fields
interface MovieType extends Omit<MovieTypeImported, "total_ratings" | "total_reactions"> {
  background_image: string;
  total_reviews: number;
  average_rating: number;
}

type CommentType = {
  id: number;
  user: string;
  text: string;
  created_at: string;
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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

  useEffect(() => {
    const fetchReactions = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await axios.get(`${API_URL}api/movies/${id}/reactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHearted(response.data.hearted);
        setTotalHearts(response.data.total_hearts);
      } catch (err) {
        console.error("Error fetching reactions:", err);
      }
    };

    fetchReactions();
  }, [id, API_URL]);

  const handleToggleHeart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You must be logged in to react.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}api/movies/${id}/react/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHearted(response.data.hearted);
      setTotalHearts(response.data.hearted ? totalHearts + 1 : totalHearts - 1);
    } catch (err) {
      console.error("Failed to toggle heart reaction:", err);
      alert("Failed to react to movie.");
    }
  };

  useEffect(() => {
    const fetchRatings = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get<Reviews[]>(`${API_URL}api/ratings/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userRating = response.data.find((r) => r.user);
        if (userRating) {
          setRating(userRating.rating);
        }
      } catch (err) {
        setError("Failed to fetch ratings: " + (err instanceof Error ? err.message : "Unknown error"));
        console.error("Error fetching ratings:", err);
      }
    };

    fetchRatings();
  }, [id, API_URL]);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}movie/api/movies/${id}/`);
        setMovie(response.data);
      } catch (err) {
        setError("Failed to fetch movie details: " + (err instanceof Error ? err.message : "Unknown error"));
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, API_URL]);

  useEffect(() => {
    if (!id || !showComments) return;

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_URL}api/movies/${id}/comments/`);
        setComments(response.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [id, showComments, API_URL]);

  const handleRating = async (newRating: number) => {
    const movieId = Number(id);
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You must be logged in to rate this movie.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}api/reviews/`,
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
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("Failed to submit rating. Please try again.");
    }
  };

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
        `${API_URL}api/comments/create/`,
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
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-16 md:pl-16">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 p-4 sm:p-8 md:p-12">{error}</div>
        ) : !movie ? (
          <div className="text-center text-gray-400 p-4 sm:p-8 md:p-12">Movie not found.</div>
        ) : (
          <div
            className="relative min-h-screen bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${movie.background_image || movie.image})` }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            {/* Main Content */}
            <div className="z-10 relative max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto p-4 sm:p-6 md:p-8 text-white animate-fade-in">
              {/* Movie Info */}
              <div className="bg-[#181b23] p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border border-gray-800">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-red-500">
                  {movie.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4">
                  {movie.description}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Released on: {movie.release_date}
                </p>

                {/* Video Player */}
                <div className="mt-6 rounded-lg overflow-hidden border-2 border-red-500">
                  <video controls className="w-full rounded-lg">
                    <source
                      src={
                        movie.video.startsWith("http")
                          ? movie.video
                          : `${API_URL}${movie.video}`
                      }
                      type="video/mp4"
                    />
                  </video>
                </div>

                {/* Rating & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center mt-6 gap-4 sm:gap-6">
                  <div className="flex items-center">
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-300 mr-2">
                      Rate:
                    </span>
                    <ReactStars
                      count={5}
                      value={rating}
                      size={20}
                      edit={true}
                      color2="#ffd700"
                      onChange={handleRating}
                    />
                    <span className="ml-2 text-gray-300 font-semibold text-sm sm:text-base leading-none">
                      {rating ? rating.toFixed(1) : "0.0"}
                    </span>
                  </div>
                  <button
                    className="flex items-center text-gray-300 hover:text-red-500 font-semibold focus:outline-none"
                    onClick={handleToggleHeart}
                  >
                    <FaHeart
                      className={`mr-2 text-lg sm:text-xl md:text-2xl ${
                        hearted ? "text-red-500" : "text-gray-500"
                      }`}
                    />
                    <span className="text-sm sm:text-base">{totalHearts}</span>
                  </button>
                  <button
                    className="flex items-center text-gray-300 hover:text-blue-400 font-semibold focus:outline-none"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <FaComment className="mr-2 text-lg sm:text-xl md:text-2xl" />
                    <span className="text-sm sm:text-base">{movie.total_comments} Comments</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments && (
                  <div className="mt-6 p-4 sm:p-6 border border-gray-700 rounded-lg bg-[#10131a]">
                    <h3 className="text-xl sm:text-2xl font-bold text-red-500 mb-4">
                      Comments
                    </h3>
                    <div className="max-h-60 overflow-y-auto space-y-3">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-3 border-b border-gray-700 bg-gray-800 rounded-md animate-fade-in"
                          >
                            <p className="text-xs sm:text-sm font-semibold text-gray-400">
                              {comment.user}
                            </p>
                            <p className="text-gray-200 text-sm sm:text-base">
                              {comment.text}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center">No comments yet.</p>
                      )}
                    </div>
                    <div className="mt-4">
                      <textarea
                        className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <button
                        className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-200 text-sm sm:text-base"
                        onClick={handleAddComment}
                        disabled={submitting}
                      >
                        {submitting ? "Adding..." : "Add Comment"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Go Back Button */}
                <button
                  onClick={() => router.back()}
                  className="mt-6 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-all duration-200 text-sm sm:text-base"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MovieDetails;