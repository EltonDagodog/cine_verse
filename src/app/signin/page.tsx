"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Navbar from "../components/navbar";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}users/login/`, {
        email,
        password,
      });

      const { access_token, refresh_token } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      router.push("/homepage");
    } catch (err) {
      setError(
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <Navbar />
 
      {/* Background with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop")`,
        }}
      ></div>

      {/* Main Content */}
      <main className="pt-16 pl-16 md:pl-16 flex justify-center items-center min-h-screen">
        <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 bg-[#181b23] rounded-lg shadow-xl animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center mb-6 sm:mb-8">
            Sign In
          </h1>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4 sm:mb-6">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm sm:text-base text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-all duration-200 font-semibold text-sm sm:text-base disabled:bg-red-400"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <Link href="/signup" className="text-gray-300 text-sm sm:text-base hover:text-red-500 transition-all duration-200">
              New to the platform? Sign up now.
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;