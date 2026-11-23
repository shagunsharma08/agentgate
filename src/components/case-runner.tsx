import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Play, LoaderCircle } from 'lucide-react';
import { analyzeCase } from '@/lib/agent.functions';
import type { AnalysisResult } from '@/lib/cases';
import { Button } from './ui/button';
import { AgentResult } from './agent-result';

export function CaseRunner({ description }: { description: string }) {
  const run = useServerFn(analyzeCase);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [runId, setRunId] = useState(0);
  const [analyzedDescription, setAnalyzedDescription] = useState<string | null>(null);
  async function analyze() {
    setBusy(true); setResult(null); setAnalyzedDescription(description);
    try { setResult(await run({ data: { description } })); }
    catch { setResult({ ok: false, error: 'Could not reach live AI. Your case is preserved; no action was taken.' }); }
    finally { setBusy(false); setRunId(id => id + 1); }
  }
  return <div className="mt-4"><Button disabled={busy || !description.trim() || description.length > 1000} onClick={analyze}>{busy ? <LoaderCircle className="animate-spin" /> : <Play />} {busy ? 'Analyzing case…' : 'Run agent'}</Button>{busy && <p role="status" className="mt-3 text-xs text-muted-foreground">Live AI is proposing a cause and next action. No action has been taken.</p>}{result && analyzedDescription === description && <AgentResult key={runId} result={result} />}</div>;
}