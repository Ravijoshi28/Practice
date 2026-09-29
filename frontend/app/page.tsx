import Link from "next/link";
import { ArrowDown, ArrowUpRight, Link2, MousePointer2, Check } from "lucide-react";
import { Brand, Footer } from "./components/brand";

export default function Home() {
  return <div className="site-shell">
    <header className="site-nav"><Brand /><nav aria-label="Main navigation"><a className="quiet-link" href="#how-it-works">How it works</a><Link className="quiet-link" href="/auth/login">Log in</Link><Link className="button button-dark" href="/auth/signup">Get started <ArrowUpRight size={16} /></Link></nav></header>
    <main>
      <section className="hero">
        <div className="hero-copy reveal"><p className="eyebrow"><span className="status-dot" /> LESS LINK. MORE POSSIBILITY.</p><h1>Good things.<br />Short links.</h1><p className="hero-description">Give your next big idea a smaller address. Create memorable links, share them anywhere, and see where they go.</p><div className="hero-actions"><Link className="button button-green" href="/auth/signup">Make your first link <ArrowUpRight size={18} /></Link><span>No clutter. Just connections.</span></div><a className="explore-link" href="#how-it-works"><ArrowDown size={16} /> A little link goes a long way</a></div>
        <div className="link-art reveal" aria-label="Illustration of a long URL becoming a short, shareable link"><div className="art-top"><span>THE SHORTER WAY THERE</span><span>01 / 03</span></div><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="long-link"><span className="mini-label">START WITH SOMETHING LONG</span><span>your-website.com/ideas/the-next-big-thing</span></div><div className="connector-line" /><div className="short-link"><span className="link-symbol"><Link2 size={27} /></span><div><span className="mini-label">MAKE IT YOURS</span><strong>your.link / big-idea</strong></div><ArrowUpRight size={26} /></div><div className="ready-tag"><Check size={14} /> A little easier to share.</div><div className="art-bottom"><span>ONE LINK. ENDLESS DIRECTIONS.</span><MousePointer2 size={18} /></div></div>
      </section>
      <section id="how-it-works" className="how-section"><div><p className="eyebrow">SMALL BY DESIGN</p><h2>Less friction.<br />More getting there.</h2></div><div className="steps">{[["01", "Paste the destination", "An article, a project, a place worth going. Start with any long URL."], ["02", "Give it a little personality", "Choose a custom alias that makes your link easy to recognize."], ["03", "Send it on its way", "Copy, share, and follow the clicks from your own workspace."]].map(([number, title, description]) => <article key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={18} /></article>)}</div></section>
    </main><Footer />
  </div>;
}
