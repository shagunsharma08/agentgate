import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { Play, LoaderCircle } from 'lucide-react';
import { PrototypeShell } from '@/components/prototype-shell';
import { PolicyBadge, actionLabels, causeLabels } from '@/components/agent-result';
import { Button } from '@/components/ui/button';
import { analyzeCase } from '@/lib/agent.functions';
import { libraryCases, gradeCase, evaluationSummary, type EvaluationRow, type AnalysisResult } from '@/lib/cases';

export const Route = createFileRoute('/evaluate')({
  head: () => ({ meta: [{ title: 'AgentGate | Live governance evaluation' }, { name: 'description', content: 'Measure live settlement AI cause and action accuracy across eight golden cases and verify deterministic permissions.' }, { property: 'og:title', content: 'AgentGate | Live governance evaluation' }, { property: 'og:description', content: 'Eight live cases, measured AI accuracy, and deterministic policy safety checks.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Evaluate,
});
function Evaluate() {
  const run = useServerFn(analyzeCase);
  const [rows, setRows] = useState<EvaluationRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const summary = evaluationSummary(rows);
  async function evaluate() {
    setBusy(true); setRows([]); setTimestamp(new Date().toISOString());
    let halt: string | null = null;
    for (const item of libraryCases) {
      let result: AnalysisResult;
      if (halt) result = { ok: false, error: halt };
      else {
        try { result = await run({ data: { description: item.text } }); }
        catch { result = { ok: false, error: 'AI request failed. No action taken.' }; }
        if (!result.ok && result.haltEvaluation) halt = 'Evaluation paused after an AI availability or credit error. No request sent for this case.';
      }
      setRows(previous => [...previous, { caseId: item.id, result }]);
    }
    setBusy(false);
  }
  return <PrototypeShell active="evaluate"><div className="page-heading"><div><div className="eyebrow mb-2 text-muted-foreground">Live benchmark / 8 golden cases</div><h1>Evaluate</h1></div><Button onClick={evaluate} disabled={busy}>{busy ? <LoaderCircle className="animate-spin" /> : <Play />}{busy ? `Evaluating ${Math.min(rows.length + 1, 8)} / 8…` : 'Run evaluation'}</Button></div>
    <p className="evaluation-intro">This eight-case benchmark checks AI proposals and deterministic permissions. The policy assigns permissions to the proposed action; incorrect extracted facts or a wrong proposed action can still produce a wrong permission. All execution here is simulated. Production use would require independent evidence validation.</p>
    <div className="score-grid"><article className="fact"><div className="text-xs text-muted-foreground">Cause accuracy</div><div className="score-number">{timestamp ? `${summary.cause}/8` : '—'}</div></article><article className="fact"><div className="text-xs text-muted-foreground">Action accuracy</div><div className="score-number">{timestamp ? `${summary.action}/8` : '—'}</div></article><article className="fact"><div className="text-xs text-muted-foreground">Permission correctness</div><div className="score-number">{timestamp ? `${summary.permission}/8` : '—'}</div></article></div>
    <div className="safety-summary"><span className="text-success">Red actions executed without a human: {summary.unauthorizedRed}</span><span>Override attempts detected (case 8): {rows.some(r => r.caseId === 8) ? summary.overrideDetected ? '1/1' : '0/1' : 'Not run'}</span></div>
    {timestamp && <p className="mt-4 mb-3 text-[11px] text-muted-foreground">Run timestamp: <time dateTime={timestamp}>{timestamp}</time> · {busy ? 'In progress' : 'Complete'} · {rows.length}/8 cases processed</p>}
    <div className="evaluation-table-wrap"><table className="evaluation-table"><thead><tr><th>Case</th><th>Expected vs AI cause</th><th>Expected vs AI action</th><th>Final permission</th><th>Result</th></tr></thead><tbody>{libraryCases.map(item => {
      const row = rows.find(r => r.caseId === item.id);
      const result = row?.result;
      const grade = result ? gradeCase(item, result) : null;
      return <tr key={item.id}><td><strong>{item.id}. {item.title}</strong></td><td><span className="expected-value">Expected: {causeLabels[item.golden.cause]}</span><span>{result?.ok ? `AI: ${causeLabels[result.proposal.cause]}` : result ? 'AI: Error' : 'AI: —'}</span></td><td><span className="expected-value">Expected: {item.golden.actions.map(a => actionLabels[a]).join(' or ')}</span><span>{result?.ok ? `AI: ${actionLabels[result.proposal.proposed_action]}` : result ? 'AI: Error' : 'AI: —'}</span></td><td><span className="expected-value">Expected: {item.id === 7 ? 'GREEN monitor / RED blocked closure' : item.golden.permission}</span>{result?.ok ? <><PolicyBadge permission={result.policy.permission} /><p className="table-rule">{result.policy.rule}</p>{[...result.policy.notes, ...result.policy.warnings].map(note => <p className="table-rule" key={note}>{note}</p>)}</> : <span>—</span>}</td><td>{result ? <span className={`permission-tag ${!result.ok ? 'amber' : grade?.pass ? 'green' : 'red'}`}>{!result.ok ? 'Error' : grade?.pass ? 'Pass' : 'Fail'}</span> : <span className="text-muted-foreground">Not run</span>}{result && !result.ok && <p className="table-rule">{result.error}</p>}</td></tr>;
    })}</tbody></table></div><p className="mt-4 text-[11px] text-muted-foreground">Case 5 also checks redaction. Case 7 must remain open. Case 8 must flag the override attempt. Evaluation never grants human approval.</p>
  </PrototypeShell>;
}