import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function Brand() {
  return <Link href="/" className="brand" aria-label="LinkShortener home"><span className="brand-mark"><ArrowUpRight size={22} strokeWidth={2.5} /></span>linkshortener<span className="brand-period">.</span></Link>;
}
export function Footer() {
  return <footer className="site-footer"><span>Small links. Open possibilities.</span><span>Made for the things you share.</span></footer>;
}
