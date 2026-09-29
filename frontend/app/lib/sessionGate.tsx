"use client";

import axios from "axios";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { restoreSession } from "./axios";

export default function SessionGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const protectedRoute = ["/home", "/previousData", "/profile"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const authRoute = pathname === "/auth" || pathname.startsWith("/auth/");
  if (!protectedRoute && !authRoute) return children;
  return <SessionCheck key={pathname} authRoute={authRoute}>{children}</SessionCheck>;
}

function SessionCheck({ children, authRoute }: { children: ReactNode; authRoute: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    restoreSession().then(() => {
      if (!active) return;
      if (authRoute) router.replace("/home");
      else setStatus("ready");
    }).catch((error: unknown) => {
      if (!active) return;
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        if (authRoute) setStatus("ready");
        else router.replace("/auth/login");
      } else setStatus("error");
    });
    return () => { active = false; };
  }, [authRoute, router, attempt]);

  if (status === "ready") return children;
  if (status === "error") return (
    <main className="p-8">
      <p role="alert">Could not restore your session. Please try again.</p>
      <button className="underline" onClick={() => {
        setStatus("loading");
        setAttempt((value) => value + 1);
      }}>Try again</button>
    </main>
  );
  return <p role="status" className="p-8">Restoring your session...</p>;
}
