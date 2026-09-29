import type { ReactNode } from "react";
import { Brand } from "./brand";
export default function AuthShell({ children }: { children: ReactNode }) {
  return <main className="auth-shell"><aside className="auth-story"><Brand /><div><p className="eyebrow">A SHORTER WAY TO CONNECT</p><h2>Big ideas.<br />Small addresses.</h2><p>Your projects, your favorite finds, your next big thing. Give them a link worth sharing.</p></div><small>Small links. Open possibilities.</small></aside><section className="auth-form-side"><div className="auth-form reveal">{children}</div></section></main>;
}
