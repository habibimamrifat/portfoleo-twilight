"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { callApi } from "@/api/callApi";
import { setAuthToken, setRenewToken } from "@/api/token";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await callApi(
        "/auth/login",
        "POST",
        {
          email,
          password,
        },
        false,
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Invalid email or password.");
        return;
      }

      setAuthToken(result.data.authToken);
      setRenewToken(result.data.renewToken);

      router.push("/dashboard/profile");
    } catch {
      setError("Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/0 p-8 backdrop-blur-xs">
        <h1 className="mb-2 text-3xl font-semibold text-white">
          Welcome back
        </h1>

        <p className="mb-8 text-white/60">
          Log in to your portfolio dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-5"
        autoComplete="off">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-white/70"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/40"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-white/70"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/40"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}