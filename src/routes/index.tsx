import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowDownLeft, ArrowRight, ArrowRightLeft, BarChart3, Building2, Check, CheckCheck, ChevronRight, Clock3, Info, Layers3, LockKeyhole, RotateCcw, ShieldCheck, Timer, TriangleAlert, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestingGuide } from '@/components/testing-guide';
import { AppNavigation } from '@/components/app-navigation';
import { initialEvents, resolveDecision, type Decision, type Permission } from '@/lib/settlement';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'AgentGate | Review case EXC-2047' },
    { name: 'description', content: 'Review a fictional settlement exception and decide where autonomous action ends and human oversight begins.' },
    { property: 'og:title', content: 'AgentGate | Review case EXC-2047' },
    { property: 'og:description', content: 'A settlement governance concept demo by Shagun. Review the facts and authorize the next step.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function PermissionTag({ tone, children }: { tone: Permission; children: React.ReactNode }) {
  return <span className={`permission-tag ${tone}`}>{children}</span>;
}

const options = [
  { id: 'borrow' as const, label: 'Borrow shares', icon: ArrowRightLeft, note: 'Arrange a borrow to cover the 2,000-share shortfall.', permission: 'red' as const, tag: 'Human execution' },
  { id: 'wait' as const, label: 'Wait for incoming shares', icon: Clock3, note: 'Monitor the expected delivery. Only 30 minutes of buffer.', permission: 'amber' as const, tag: 'Timing risk' },
  { id: 'partial' as const, label: 'Partial settlement', icon: Layers3, note: 'Settle the 8,000 available shares. Keep 2,000 open.', permission: 'green' as const, tag: 'Partial resolution' },
];

function Index() {
  const [decision, setDecision] = useState<Decision | null>(null);
  const outcome = decision ? resolveDecision(decision) : null;
  const events = [...initialEvents, ...(outcome?.events ?? [])];
  const status = outcome?.closed ? 'Settled and closed' : decision === 'partial' ? 'Partially settled – 2,000 shares open' : decision === 'wait' ? 'Awaiting incoming shares' : 'Settlement failed – seller short of shares';

  return (
    <div className="min-h-screen bg-background">
      <div className="demo-banner"><span className="inline-flex items-start justify-center gap-2"><Info size={13} className="mt-0.5 shrink-0" /><span>Independent concept demo by Shagun. Not affiliated with or endorsed by DTCC. Firms and the trade are fictional. Market context uses public SEC Fails-to-Deliver data.</span></span></div>
      <header className="app-header">
        <div className="brand"><span className="brand-mark"><ShieldCheck size={35} strokeWidth={1.7} /></span>AgentGate<span className="header-context">Agent governance console</span></div>
        <div className="flex items-center gap-3"><div className="analyst-label text-right"><div className="text-xs font-medium">Operations analyst</div><div className="mt-1 text-[10px] text-muted-foreground">Settlement operations</div></div><span className="analyst-avatar"><UserRound size={16} /></span></div>
      </header>
      <AppNavigation active="demo" />
      <main className="console">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground"><span>Settlement operations</span><ChevronRight size={12} /><span>Exceptions</span><ChevronRight size={12} /><span className="font-mono text-foreground">EXC-2047</span></div>
        <section aria-labelledby="case-heading">
          <div className="page-heading">
            <div><div className="eyebrow mb-2 text-muted-foreground">Exception review <span className="mx-2 text-border">/</span> <span className="font-mono">EXC-2047</span></div><h1 id="case-heading">Settlement exception</h1><p className={`mt-2 flex items-center gap-2 text-xs ${outcome?.closed ? 'text-success' : 'text-muted-foreground'}`}>{outcome?.closed ? <CheckCheck size={14} /> : <TriangleAlert size={14} className="text-danger" />}{status}</p></div>
            <PermissionTag tone={outcome?.closed ? 'green' : decision ? 'amber' : 'red'}>{outcome?.closed ? 'Case closed' : decision ? 'Agent monitoring' : 'Human decision required'}</PermissionTag>
          </div>
          <div className="trade-summary">
            <div className="party"><span className="party-icon"><Building2 size={20} strokeWidth={1.5} /></span><div><div className="eyebrow mb-1.5 text-muted-foreground">Buyer · Fund</div><div className="text-[13px] font-semibold">Northbridge Capital</div></div></div>
            <div className="trade-asset"><div className="eyebrow mb-1.5 text-muted-foreground">Trade details</div><div className="text-[13px] font-semibold">10,000 shares of Alphabet Class A <span className="ml-1 font-mono text-[10px] font-normal text-muted-foreground">GOOGL</span></div><div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground"><ArrowRight size={12} />Delivery versus payment</div><div className="real-world-note"><BarChart3 size={13} className="mt-0.5 shrink-0" /><span><strong className="font-semibold text-foreground">Real-world context.</strong> Real data: on Oct 30, 2026, about 458,000 GOOGL shares (~$130M) were in fails-to-deliver across NSCC members. Source: SEC Fails-to-Deliver data. The trade in this demo is fictional.</span></div></div>
            <div className="party"><span className="party-icon"><Building2 size={20} strokeWidth={1.5} /></span><div><div className="eyebrow mb-1.5 text-muted-foreground">Seller · Broker</div><div className="text-[13px] font-semibold">Halden Securities</div></div></div>
          </div>
        </section>
        <section className="mt-7" aria-labelledby="facts-heading">
          <div className="flex items-center justify-between"><h2 id="facts-heading" className="section-heading">Decision facts</h2><span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-success" />Snapshot at escalation</span></div>
          <div className="facts">
            <article className="fact"><div className="flex items-center justify-between text-xs text-muted-foreground"><span>Time to settlement deadline</span><Timer size={16} /></div><div className="fact-number font-mono">2h <span className="text-muted-foreground">54m</span></div><div className="fact-footer"><span className="h-1.5 w-1.5 rounded-full bg-foreground" />Deadline at 12:00</div></article>
            <article className="fact"><div className="flex items-center justify-between text-xs text-muted-foreground"><span>Incoming shares expected in</span><ArrowDownLeft size={16} /></div><div className="fact-number font-mono">2h <span className="text-muted-foreground">24m</span></div><div className="fact-footer"><TriangleAlert size={12} className="text-warning" /><span className="text-warning">Cutting it close · 30-minute buffer</span></div></article>
            <article className="fact"><div className="flex items-center justify-between text-xs text-muted-foreground"><span>Shares available now</span><Layers3 size={16} /></div><div className="fact-number font-mono">8,000 <span className="text-sm text-muted-foreground">/ 10,000</span></div><div className="fact-footer">2,000-share shortfall <span className="ml-auto font-mono">80%</span></div><div className="availability" aria-label="80 percent of shares available" /></article>
          </div>
        </section>
        <div className="work-area">
          <section aria-labelledby="timeline-heading">
            <div className="timeline-header"><h2 id="timeline-heading" className="section-heading">Agent activity</h2><div className="flex items-center gap-3"><span className="text-[10px] text-muted-foreground">Permission trail</span><ShieldCheck size={14} className="text-muted-foreground" /></div></div>
            <ol className="timeline" aria-live="polite" aria-label="Agent timeline">
              {events.map((event, i) => <li key={`${decision ?? 'initial'}-${i}`} className={`timeline-item ${i >= initialEvents.length ? 'new-event' : ''}`}><time className="timeline-time">{event.time}</time><div className="timeline-marker"><span className={`timeline-dot ${event.permission}`}>{event.permission === 'red' ? <LockKeyhole size={12} /> : event.permission === 'amber' ? <Clock3 size={12} /> : <Check size={12} />}</span></div><div className="pb-5"><p className="timeline-description">{event.description}</p>{event.policyNote && <p className="mb-2 text-[10px] leading-relaxed text-muted-foreground">{event.policyNote}</p>}<div className="flex flex-wrap items-center gap-2"><PermissionTag tone={event.permission}>{event.tag}</PermissionTag>{event.detail && <span className="text-[10px] text-muted-foreground">{event.detail}</span>}</div></div></li>)}
            </ol>
            <div className="flex items-center gap-2 pl-[65px] text-[10px] text-muted-foreground"><span className={`h-1.5 w-1.5 rounded-full ${outcome?.closed ? 'bg-success' : 'bg-warning'}`} />{outcome?.closed ? 'All shares settled. No further action required.' : decision ? 'Decision recorded. Agent activity updated.' : 'Agent paused. Awaiting your decision.'}</div>
          </section>
          <section className="decision-area" aria-labelledby="decision-heading">
            <div className="flex items-center gap-2"><UserRound size={16} /><h2 id="decision-heading" className="section-heading">{decision ? 'Your decision' : 'Choose the next step'}</h2></div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{decision ? 'Authorized by the operations analyst.' : 'The agent has reached its authority limit. This decision stays with you.'}</p>
            {options.map(option => <div key={option.id} className={`decision-option ${decision === option.id ? 'selected' : ''}`}><Button variant="decision" disabled={decision !== null} onClick={() => setDecision(option.id)}><span className="flex items-center gap-2.5"><option.icon size={16} />{option.label}</span>{decision === option.id ? <Check size={16} className="text-success" /> : <ArrowRight size={15} />}</Button><p className="decision-note">{option.note}</p><div className="mt-2.5"><PermissionTag tone={option.permission}>{option.tag}</PermissionTag></div></div>)}
            <div className="guardrail"><ShieldCheck size={16} className="mt-0.5 shrink-0" /><span><strong className="font-semibold text-foreground">Human authority. Agent accountability.</strong><br />The agent can investigate and monitor. Borrowing or moving shares requires a human decision.</span></div>
            <Button variant="ghost" size="sm" className="mt-4 w-full gap-2 text-muted-foreground" onClick={() => setDecision(null)}><RotateCcw size={13} />Reset demo</Button>
          </section>
        </div>
        <TestingGuide />
        <footer className="console-footer"><span className="flex items-center gap-1.5"><ShieldCheck size={12} />AgentGate <span className="mx-1">·</span> Governed autonomy, by design.</span><span>Concept demo <span className="mx-1">/</span> Fictional case EXC-2047</span></footer>
      </main>
    </div>
  );
}
