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

export async function updateLimit(
  id: string,
  input: { name?: string; limitAmount?: number }
): Promise<CategoryLimit> {
  const { data } = await api.patch<CategoryLimit>(`/limits/${id}`, input);
  return data;
}

export async function deleteLimit(id: string): Promise<void> {
  await api.delete(`/limits/${id}`);
}

export async function listActivities(categoryId?: string): Promise<Activity[]> {
  const { data } = await api.get<Activity[]>('/activities', {
    params: categoryId ? { categoryId } : undefined
  });
  return data;
}

export async function updateActivity(
  id: string,
  input: { categoryId?: string; amount?: number; description?: string; occurredAt?: string }
): Promise<Activity> {
  const { data } = await api.patch<Activity>(`/activities/${id}`, input);
  return data;
}

export async function deleteActivity(id: string): Promise<void> {
  await api.delete(`/activities/${id}`);
}

export async function getSummary(): Promise<LimitSummary[]> {
  const { data } = await api.get<LimitSummary[]>('/limit-summary');
  return data;
}
