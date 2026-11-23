import { Link } from '@tanstack/react-router';
import { BookOpen, FlaskConical, ShieldCheck, ArrowRight, BrainCircuit } from 'lucide-react';
import { Button } from './ui/button';

export function AppNavigation({ active }: { active: 'demo' | 'library' | 'evaluate' }) {
  const tabs = [{ id: 'demo', to: '/', label: 'Guided demo', icon: ShieldCheck }, { id: 'library', to: '/case-library', label: 'Case library', icon: BookOpen }, { id: 'evaluate', to: '/evaluate', label: 'Evaluate', icon: FlaskConical }] as const;
  return <div className="prototype-navigation"><nav aria-label="Main tabs" className="prototype-tabs">{tabs.map(tab => <Button key={tab.id} asChild variant="ghost" className={active === tab.id ? 'active-tab' : ''}><Link to={tab.to} aria-current={active === tab.id ? 'page' : undefined}><tab.icon size={15} />{tab.label}</Link></Button>)}</nav><div className="policy-principle"><strong>The AI proposes; the policy decides.</strong><span><BrainCircuit size={13} />AI proposal<ArrowRight size={12} /><ShieldCheck size={13} />TypeScript policy</span></div></div>;
}