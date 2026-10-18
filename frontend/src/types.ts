// Shared types matching the backend schemas — v2

export type Personality = 'friendly' | 'brutally_honest' | 'unhinged';

export type Verdict = 'GUILTY' | 'MOSTLY GUILTY' | 'NOT GUILTY';

export interface EvidenceItem {
  title: string;
  description: string;
  exhibit_label: string;
}

export interface CourtroomEvent {
  type: 'objection' | 'event' | 'interruption';
  character: string;
  description: string;
}

export interface TrialResult {
  id: string;
  confession: string;
  category: string;
  personality: string;
  judge_name: string;
  prosecutor_name: string;
  defense_name: string;
  evidence: EvidenceItem[];
  prosecution_arguments: string[];
  defense_arguments: string[];
  courtroom_events: CourtroomEvent[];
  verdict: Verdict;
  sentence: string;
  severity_score: number;
  created_at: string;
}

export interface CaseSummary {
  id: string;
  confession: string;
  category: string;
  verdict: Verdict;
  sentence: string;
  severity_score: number;
  created_at: string;
}

export interface TrialRequest {
  confession: string;
  personality: Personality;
}
