import axios from 'axios';
import type { Activity, CategoryLimit, LimitSummary } from '../types';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

export async function listLimits(): Promise<CategoryLimit[]> {
  const { data } = await api.get<CategoryLimit[]>('/limits');
  return data;
}

export async function createLimit(input: { name: string; limitAmount: number }): Promise<CategoryLimit> {
  const { data } = await api.post<CategoryLimit>('/limits', { ...input, period: 'monthly' });
  return data;
}

export async function listActivities(categoryId?: string): Promise<Activity[]> {
  const { data } = await api.get<Activity[]>('/activities', {
    params: categoryId ? { categoryId } : undefined
  });
  return data;
}

export async function getSummary(): Promise<LimitSummary[]> {
  const { data } = await api.get<LimitSummary[]>('/limit-summary');
  return data;
}
