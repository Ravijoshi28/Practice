"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Link2, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShortApi } from "../apicalls/shortner";
import { Brand, Footer } from "../components/brand";
import PreviousData from "./userData/page";

export default function Home() {
  const queryClient = useQueryClient();
  const [link, setLink] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const mutation = useMutation({
    mutationFn: ShortApi,
    onError: (error) => setError(error instanceof Error ? error.message : "Could not create your link. Please try again."),
    onSuccess: () => {
      setLink(""); setAlias("");
      return queryClient.invalidateQueries({ queryKey: ["previousData"] });
    },
  });
  function createShort(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    try { if (!["http:", "https:"].includes(new URL(link.trim()).protocol)) throw new Error(); }
    catch { setError("Enter a valid URL starting with https:// or http://."); return; }
    mutation.mutate({ link: link.trim(), alias: alias.trim() });
  }
  return <div className="site-shell"><header className="site-nav"><Brand /><nav aria-label="Workspace navigation"><Link className="quiet-link" href="/">Overview</Link><a className="button button-dark" href="#your-links">Your links <ArrowUpRight size={16} /></a></nav></header>
    <main className="workspace reveal"><header className="workspace-heading"><div><p className="eyebrow"><span className="status-dot" /> YOUR WORKSPACE</p><h1>A home for your links.</h1><p>Something worth sharing? Give it a shorter way there.</p></div><span className="count-label">CREATE. SHARE. REPEAT.</span></header>
      <div className="workspace-grid"><section className="create-panel" aria-labelledby="create-title"><h2 className="section-title" id="create-title"><Plus size={19} /> Create a short link</h2><form onSubmit={createShort}><div className="field"><label htmlFor="original-link">Destination URL</label><input id="original-link" type="url" required placeholder="https://your-website.com/something-worth-sharing" value={link} onChange={e => { setLink(e.target.value); setError(""); mutation.reset(); }} aria-invalid={!!error} aria-describedby={error ? "link-error" : undefined} /></div><div className="field"><label htmlFor="alias">Custom alias <span>/ optional</span></label><input id="alias" placeholder="your-next-big-idea" value={alias} onChange={e => setAlias(e.target.value)} /><p className="helper">Keep it short, memorable, and uniquely yours.</p></div>{error && <p className="form-error" role="alert" id="link-error">{error}</p>}{mutation.isSuccess && <p className="form-success" role="status">Your link is ready. Find it in your collection below.</p>}<button className="button button-dark" disabled={mutation.isPending}>{mutation.isPending ? "Creating your link..." : "Shorten link"}<ArrowUpRight size={17} /></button></form></section><aside className="note-panel"><Link2 size={30} strokeWidth={1.5} /><h2>A small detail.<br />A better impression.</h2><p>A custom alias tells people where they are going before they even click. Try a project name, a topic, or a simple hello.</p><code>/ your-next-big-idea</code></aside></div>
      <section className="library" id="your-links"><PreviousData /></section>
    </main><Footer /></div>;
}
