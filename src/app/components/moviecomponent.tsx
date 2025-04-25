import Image from "next/image";
import ReactStars from "react-stars";

export type MovieType = {
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

export interface MovieCardProps {
  movie: MovieType;
  apiUrl: string;
  onWatchNow: (movieId: number) => void;
}

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
  </div>
);

export const MovieCard = ({ movie, apiUrl, onWatchNow }: MovieCardProps) => (
  <div
    className="relative bg-[#181b23] p-4 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-fade-in"
    style={{ animationDelay: `${movie.id * 100}ms` }}
  >
    <Image
      src={movie.image.startsWith("http") ? movie.image : `${apiUrl}${movie.image}`}
      alt={movie.title}
      width={300}
      height={450}
      className="w-full h-auto rounded-lg shadow-lg"
      loading="lazy"
    />
    <p className="text-white mt-2 text-center text-base sm:text-lg font-semibold">{movie.title}</p>
    <div className="mt-3 w-full text-center">
      <p className="text-gray-300 text-xs sm:text-sm font-bold">Total Ratings</p>
      <div className="flex justify-center items-center mt-1">
        <ReactStars
          count={5}
          value={movie.total_ratings}
          size={18}
          edit={false}
          color2="#ffd700"
        />
        <span className="ml-2 text-gray-300 font-semibold text-sm sm:text-base leading-none">
          {typeof movie.total_ratings === "number" ? movie.total_ratings.toFixed(1) : "N/A"}
        </span>
      </div>
      <p className="text-gray-400 text-xs mt-1">
        {movie.total_comments} comments · {movie.total_reactions} reactions
      </p>
    </div>
    <button
      onClick={() => onWatchNow(movie.id)}
      className="mt-4 w-full bg-red-600 text-white py-2 text-sm sm:text-base font-bold rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200"
    >
      Watch Now
    </button>
  </div>
);