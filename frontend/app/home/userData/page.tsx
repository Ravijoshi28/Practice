"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GetData } from "@/app/apicalls/shortner";
import { Copy, Link2, Check, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

export default function PreviousData() {
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const limit = 10;
  const { data, isPending, isError, isFetching, refetch } = useQuery({ queryKey: ["previousData", page, limit], queryFn: () => GetData(page, limit) });
  async function handleCopy(link: string) {
    try { await navigator.clipboard.writeText(`${window.location.origin}/${encodeURIComponent(link)}`); setCopied(link); toast.success("Link copied to clipboard"); }
    catch { toast.error("Could not copy. Open the link and copy it from your address bar."); }
  }
  return <><div className="library-heading"><h2>Your link collection</h2>{data && <span className="count-label">{data.pagination.totalItems} LINKS</span>}</div>
    {isPending ? <div role="status" aria-label="Loading your links"><div className="skeleton" /><div className="skeleton" /><div className="skeleton" /></div> : isError ? <div className="empty-state"><p role="alert">We could not load your links.</p><button className="button button-outline" onClick={() => refetch()}>Try again</button>{page > 1 && <button className="button button-outline" onClick={() => setPage(page - 1)}>Previous page</button>}</div> : <>
      {data.data.length === 0 ? <div className="empty-state"><Link2 size={28} strokeWidth={1.5} /><h3>{data.pagination.totalItems === 0 ? "Your next connection starts here." : "No links on this page."}</h3><p>Create a short link above and it will appear in your collection.</p></div> : data.data.map(link => <article className="link-row" key={link.id}><span className="row-icon"><Link2 size={18} /></span><div className="row-detail"><a href={`/${encodeURIComponent(link.shortLink)}`} target="_blank" rel="noopener noreferrer">/{link.shortLink} <ArrowUpRight size={12} className="inline" /></a><p title={link.originalLink}>{link.originalLink}</p></div><span className="click-count">{link.click.toLocaleString()} <span className="text-stone-500">clicks</span></span><button className="icon-button" aria-label={`Copy link ${link.shortLink}`} title={copied === link.shortLink ? "Copied" : "Copy link"} onClick={() => handleCopy(link.shortLink)}>{copied === link.shortLink ? <Check size={16} /> : <Copy size={16} />}</button></article>)}
      <nav className="pagination" aria-label="Link pagination"><p aria-live="polite">Page {data.pagination.page} of {Math.max(1, data.pagination.totalPages)}</p><div><button className="button button-outline" disabled={!data.pagination.hasPreviousPage || isFetching} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button><button className="button button-outline" disabled={!data.pagination.hasNextPage || isFetching} onClick={() => setPage(p => p + 1)}>Next</button></div></nav>
    </>}
  </>;
}
