"use client";
import { Request_Otp, Verify_otp } from "@/app/apicalls/auth";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import AuthShell from "@/app/components/auth-shell";

export default function OTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const verify = useMutation({ mutationFn: Verify_otp });
  const resend = useMutation({ mutationFn: Request_Otp });
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); verify.mutate({ email: email.trim(), otp }); }
  return <AuthShell><header><p className="eyebrow">ONE LAST LITTLE STEP</p><h1>Check your inbox.</h1><p>Request a verification code, then enter the six digits below to make it official.</p></header><form onSubmit={submit}><div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); verify.reset(); resend.reset(); }} /></div><div className="field"><label htmlFor="otp">Verification code</label><input id="otp" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" maxLength={6} required placeholder="000000" className="tracking-[.5em]" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} /></div>
    {verify.isError && <p className="form-error" role="alert">We could not verify that code. Check it and try again.</p>}{verify.isSuccess && <p className="form-success" role="status">Email verified. <Link className="text-button" href="/auth/login">Continue to log in</Link></p>}
    <button className="button button-dark" disabled={verify.isPending || verify.isSuccess}>{verify.isPending ? "Verifying..." : "Verify email"}<ArrowUpRight size={17} /></button></form><p className="auth-switch">Need a code? <button className="text-button" disabled={resend.isPending || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)} onClick={() => resend.mutate(email.trim())}>{resend.isPending ? "Sending..." : "Send code"}</button></p>{resend.isSuccess && <p className="form-success" role="status">Code sent. Check your inbox.</p>}{resend.isError && <p className="form-error" role="alert">Could not send a code. Please try again.</p>}<Link className="back-link" href="/auth/signup">Back to sign up</Link></AuthShell>;
}

