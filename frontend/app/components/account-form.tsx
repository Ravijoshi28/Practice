"use client";
import { LoginCall, Signup } from "@/app/apicalls/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import AuthShell from "./auth-shell";

export default function AccountForm({ signup = false }: { signup?: boolean }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const mutation = useMutation({ mutationFn: signup ? Signup : LoginCall, onSuccess: () => {
    if (signup) { router.push("/auth/signup/otp"); }
    else window.location.replace("/home");
  } });
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); mutation.mutate(formData); }
  return <AuthShell><header><p className="eyebrow">{signup ? "A FRESH START" : "RIGHT WHERE YOU LEFT OFF"}</p><h1>{signup ? "Make room for possibility." : "Welcome back."}</h1><p>{signup ? "Create an account and start making connections." : "Your links are waiting. Let's get you signed in."}</p></header><form onSubmit={submit}>
    {signup && <div className="field"><label htmlFor="name">Your name</label><input id="name" autoComplete="name" required minLength={3} placeholder="How should we call you?" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>}
    <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" required placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
    <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete={signup ? "new-password" : "current-password"} required minLength={8} placeholder={signup ? "Create a password" : "Enter your password"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />{signup && <p className="helper">Use at least 8 characters.</p>}</div>
    {mutation.isError && <p role="alert" className="form-error">{signup ? "Could not create your account. Check your details and try again." : "Could not log in. Check your email and password and try again."}</p>}
    <button className="button button-dark" disabled={mutation.isPending}>{mutation.isPending ? "Just a moment..." : signup ? "Create account" : "Log in"}<ArrowUpRight size={17} /></button></form>
    <p className="auth-switch">{signup ? "Already have an account? " : "New here? "}<Link href={signup ? "/auth/login" : "/auth/signup"}>{signup ? "Log in" : "Create an account"}</Link></p>{signup && <Link className="back-link" href="/auth/signup/otp">Already signed up? Verify your email</Link>}<Link className="back-link" href="/">Back to home</Link></AuthShell>;
}

