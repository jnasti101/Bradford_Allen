"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";

const STORAGE_KEY = "ba-demo-auth";
const PASSWORD = "BA123";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setAuthenticated(true);
    }
    setLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!loaded) return null;

  if (authenticated) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/images/omnia-ikon.png"
            alt="Omnia"
            width={48}
            height={48}
            className="mb-4 rounded-xl"
          />
          <h1 className="text-xl font-semibold tracking-tight">
            Bradford Allen Demo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              autoFocus
              className="w-full rounded-lg border bg-card py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          {error && (
            <p className="text-xs text-red-500">Incorrect password</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent/90"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
