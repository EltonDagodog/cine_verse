"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../components/navbar";


export default function SignupPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    contact: "",
    address: "",
    gender: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}users/register/`, formData);
      router.push("/signin");
    } catch (err) {
      setError(
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Signup failed. Please try again."
      );
      console.error("Signup error:", err);
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
      <main className="pt-16 pl-4 md:pl-4 flex justify-center items-center min-h-screen">
        <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 bg-[#181b23] rounded-lg shadow-xl animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-red-500 text-center mb-6 sm:mb-8">
            Create Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4 sm:mb-6">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm sm:text-base text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base text-gray-300 mb-2">
                  Middle Name (Optional)
                </label>
                <input
                  type="text"
                  name="middle_name"
                  placeholder="Middle Name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm sm:text-base text-gray-300 mb-2">
                Contact
              </label>
              <input
                type="text"
                name="contact"
                placeholder="Contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base text-gray-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
                required
                disabled={loading}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm sm:text-base text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
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
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}