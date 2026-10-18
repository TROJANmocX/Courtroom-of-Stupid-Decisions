import axios from 'axios';
import { TrialRequest, TrialResult, CaseSummary } from './types';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // AI can be slow
});

export const submitTrial = (data: TrialRequest): Promise<TrialResult> =>
  api.post<TrialResult>('/trial', data).then((r) => r.data);

export const fetchCases = (skip = 0, limit = 20): Promise<CaseSummary[]> =>
  api.get<CaseSummary[]>('/cases', { params: { skip, limit } }).then((r) => r.data);

export const fetchCase = (id: string): Promise<TrialResult> =>
  api.get<TrialResult>(`/cases/${id}`).then((r) => r.data);

export const deleteCase = (id: string): Promise<void> =>
  api.delete(`/cases/${id}`).then(() => undefined);

export const fetchRandomConfession = (): Promise<string> =>
  api.get<{ confession: string }>('/confession/random').then((r) => r.data.confession);
