import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { PrototypeShell } from '@/components/prototype-shell';
import { CaseRunner } from '@/components/case-runner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { libraryCases } from '@/lib/cases';

export const Route = createFileRoute('/case-library')({
  head: () => ({ meta: [{ title: 'AgentGate | Live case library' }, { name: 'description', content: 'Analyze eight fictional settlement cases with live AI proposals and independent TypeScript policy decisions.' }, { property: 'og:title', content: 'AgentGate | Live case library' }, { property: 'og:description', content: 'The AI proposes; the policy decides. Test settlement governance on fictional cases.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: CaseLibrary,
});
function CaseLibrary() {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState('');
  return <PrototypeShell active="library"><div className="page-heading"><div><div className="eyebrow mb-2 text-muted-foreground">Live analysis / Fictional cases</div><h1>Case library</h1><p className="mt-2 text-xs text-muted-foreground">Eight settlement exceptions. Independent policy. Human authority.</p></div><span className="permission-tag green">Live AI connected</span></div>
    <div className="case-grid">{libraryCases.map(item => <article className={`library-card ${selected === item.id ? 'selected-case' : ''}`} key={item.id}><Button variant="ghost" className="case-select" aria-expanded={selected === item.id} onClick={() => setSelected(selected === item.id ? null : item.id)}><span><span className="eyebrow text-muted-foreground block mb-2">Case {item.id}</span><span className="block font-semibold">{item.title}</span></span><ChevronRight size={16} /></Button>{selected === item.id && <div className="case-detail"><p className="text-xs leading-relaxed">{item.text}</p><CaseRunner description={item.text} /></div>}</article>)}</div>
    <section className="custom-case"><h2 className="section-heading">Try your own case</h2><label htmlFor="custom-case" className="block mt-3 mb-2 text-xs text-muted-foreground">Case description · fictional or redacted data only</label><Textarea id="custom-case" value={custom} onChange={e => setCustom(e.target.value)} maxLength={1000} placeholder="Describe a failed trade in plain words..." className="min-h-28" /><p className="mt-2 text-right text-[10px] text-muted-foreground">{custom.length} / 1,000 characters</p><CaseRunner description={custom} /></section>
    <aside className="guardrail"><BookOpen size={16} className="shrink-0" /><div><strong className="text-foreground">How to test this</strong><p>Pick a case, run the agent, and check the rule that fired. Then open Evaluate to see accuracy across all 8 cases.</p></div></aside>
  </PrototypeShell>;
}