"use client";

import { useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar"; // Added Sidebar
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}users/register/` ||
          "http://127.0.0.1:8000/users/register/",
        formData
      );
      alert("Signup successful!");
      
      router.push("/signin");
    } catch (_error) { 
      alert("Signup failed! Please try again.");
      console.error(_error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Sidebar />
      <div className="flex justify-center pt-20 items-center">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[400px] border border-gray-700">
          <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
            Create Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="p-1 bg-gray-800 border border-gray-600 rounded text-sm"
                required
              />
              <input
                type="text"
                name="middle_name"
                placeholder="Middle Name (Optional)"
                value={formData.middle_name}
                onChange={handleChange}
                className="p-1 bg-gray-800 border border-gray-600 rounded text-sm"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="p-1 bg-gray-800 border border-gray-600 rounded text-sm"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="p-1 bg-gray-800 border border-gray-600 rounded text-sm"
                required
              />
            </div>
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={formData.contact}
              onChange={handleChange}
              className="p-1 bg-gray-800 border border-gray-600 rounded w-full text-sm"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="p-1 bg-gray-800 border border-gray-600 rounded w-full text-sm"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-1 bg-gray-800 border border-gray-600 rounded w-full text-sm"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-1 bg-gray-800 border border-gray-600 rounded w-full text-sm"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-1 bg-gray-800 border border-gray-600 rounded w-full text-sm"
              required
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="p-1 bg-gray-800 border border-gray-600 rounded w-full text-sm"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}