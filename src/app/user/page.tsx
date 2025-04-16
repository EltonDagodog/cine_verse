"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("You need to log in to view this page.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-lg w-full border border-gray-700">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
          Account Details
        </h2>
        <div className="space-y-4 text-lg">
          <p><span className="text-gray-400">Name:</span> {user.first_name} {user.middle_name} {user.last_name}</p>
          <p><span className="text-gray-400">Username:</span> {user.username}</p>
          <p><span className="text-gray-400">Contact:</span> {user.contact}</p>
          <p><span className="text-gray-400">Address:</span> {user.address}</p>
          <p><span className="text-gray-400">Gender:</span> {user.gender}</p>
          <p><span className="text-gray-400">Email:</span> {user.email}</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/signin";
          }}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
