import type { ReactNode } from 'react';
import { Info, ShieldCheck, UserRound } from 'lucide-react';
import { AppNavigation } from './app-navigation';

export function PrototypeShell({ active, children }: { active: 'library' | 'evaluate'; children: ReactNode }) {
  return <div className="min-h-screen bg-background">
    <div className="demo-banner"><span className="inline-flex items-start justify-center gap-2"><Info size={13} className="mt-0.5 shrink-0" /><span>Independent concept demo by Shagun. Not affiliated with or endorsed by DTCC. Firms and the trade are fictional. Market context uses public SEC Fails-to-Deliver data.</span></span></div>
    <header className="app-header"><div className="brand"><span className="brand-mark"><ShieldCheck size={35} strokeWidth={1.7} /></span>AgentGate<span className="header-context">Agent governance console</span></div><div className="flex items-center gap-3"><div className="analyst-label text-right"><div className="text-xs font-medium">Operations analyst</div><div className="mt-1 text-[10px] text-muted-foreground">Settlement operations</div></div><span className="analyst-avatar"><UserRound size={16} /></span></div></header>
    <AppNavigation active={active} />
    <main className="console prototype-console">{children}<footer className="console-footer"><span className="flex items-center gap-1.5"><ShieldCheck size={12} />AgentGate · Governed autonomy, by design.</span><span>Live AI · Prototype execution only · No trades, transfers, or emails sent</span></footer></main>
  </div>;
}