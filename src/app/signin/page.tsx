"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const response = await axios.post("http://127.0.0.1:8000/users/login/", {
        email,
        password,
      });

      const { access_token, refresh_token } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      router.push("/homepage");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black relative">
      <Navbar/>
      <Sidebar/>
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/001/254/680/small_2x/cinema-background-concept.jpg")',
            opacity: 0.2
          }}>
      </div>
            
      <div className="relative z-10 w-full max-w-md mx-auto p-8 bg-black bg-opacity-60 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">Sign In</h1>
        
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white rounded-md text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white rounded-md text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/signup" className="text-white text-sm hover:underline">
            New to the platform? Sign up now.
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
