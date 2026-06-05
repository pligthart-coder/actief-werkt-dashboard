"use client";

import { useState } from "react";

export default function SetupPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const runMigrations = async () => {
    setLoading(true);
    setError("");
    setStatus("Running database migrations...");

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setStatus("✅ Database setup complete! You can now register and use the app.");
      } else {
        setError(data.error || "Migration failed");
      }
    } catch (err: any) {
      setError(err.message || "Failed to run migrations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Database Setup
          </h1>
          <p className="text-gray-600">
            Actief Werkt! Go-live Dashboard
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-900 mb-2">
              First Time Setup
            </h2>
            <p className="text-sm text-blue-800">
              Click the button below to initialize the database. This only needs
              to be done once after deployment.
            </p>
          </div>

          {status && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {status}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <button
            onClick={runMigrations}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Setting up database..." : "Initialize Database"}
          </button>

          <div className="text-center text-sm text-gray-600">
            <p>
              After setup is complete,{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                register your first user
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
