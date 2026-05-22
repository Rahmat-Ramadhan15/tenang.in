"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {

  const router =
    useRouter();

  const [nama, setNama] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setLoading(true);

        const res =
          await fetch(
            "/api/auth/register",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                nama,
                email,
                password,
              }),
            }
          );

        const data =
          await res.json();

        if (res.ok) {

          alert(
            "Register berhasil"
          );

          router.push(
            "/login"
          );

        } else {

          alert(
            data.message ||
              "Register gagal"
          );
        }

      } catch (error) {

        console.error(error);

        alert(
          "Terjadi error"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen bg-[#0b0b12] flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        <div className="bg-[#15151f] border border-purple-500/10 rounded-3xl shadow-2xl px-10 py-12">

          {/* ICON */}
          <div className="flex justify-center mb-6">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">

              <span className="text-white text-3xl">
                ♡
              </span>

            </div>

          </div>

          {/* TITLE */}
          <div className="text-center mb-8">

            <h1 className="text-4xl font-bold text-white mb-2">
              Create Account
            </h1>

            <p className="text-gray-400">
              Start your mental wellness journey today
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={
              handleRegister
            }
            className="space-y-5"
          >

            {/* NAME */}
            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">

                Full Name

              </label>

              <input
                type="text"
                placeholder="John Doe"
                value={nama}
                onChange={(e) =>
                  setNama(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0f0f14] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

            </div>

            {/* EMAIL */}
            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">

                Email

              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0f0f14] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">

                Password

              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0f0f14] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-all"
            >

              {loading
                ? "Loading..."
                : "Create Account"}

            </button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-gray-400 text-sm mt-6">

            Already have an account?{" "}

            <Link
              href="/login"
              className="text-purple-400 font-semibold hover:underline"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}