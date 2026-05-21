import { useCallback, useEffect, useState } from 'react';
import { LimitForm } from './components/LimitForm';
import { LimitSummaryList } from './components/LimitSummaryList';
import { ActivityList } from './components/ActivityList';
import { getSummary, listActivities, listLimits } from './api/client';
import type { Activity, CategoryLimit, LimitSummary } from './types';

const monthLabel = new Intl.DateTimeFormat('en-NG', { month: 'long', year: 'numeric' }).format(new Date());

export default function App() {
  const [summary, setSummary] = useState<LimitSummary[]>([]);
  const [limits, setLimits] = useState<CategoryLimit[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, l, a] = await Promise.all([getSummary(), listLimits(), listActivities()]);
      setSummary(s);
      setLimits(l);
      setActivities(a);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-3 z-50 px-4">
        <nav className="mx-auto flex w-full max-w-container items-center justify-between gap-3 rounded-pill border border-hairline bg-white/85 px-2 py-2 backdrop-blur">
          <div className="flex items-center gap-2 px-1">
            <img src="/icons/logo.png" alt="Finzla" className="h-9 w-9 rounded-full bg-ink object-cover" />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-ink">Finzla</span>
              <span className="hidden text-xs text-muted sm:block">Category limits</span>
            </span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="chip font-mono">{monthLabel}</span>
          </div>
        </nav>
      </header>

      <main className="container-x py-6 sm:py-10">
        <section className="mb-6 animate-fade-up sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            Track monthly spend against category limits.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Create a category, log activities, and see usage with a status badge —
            <span className="font-mono text-ink"> On Track</span>,
            <span className="font-mono text-amber-700"> Warning</span>, or
            <span className="font-mono text-rose-700"> Exceeded</span>.
          </p>
        </section>

        {error && (
          <div role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <aside className="md:col-span-1">
            <LimitForm onCreated={refresh} />
          </aside>

          <section className="md:col-span-2 space-y-8">
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">This month</h2>
                <span className="font-mono text-[11px] text-muted">{summary.length} categories</span>
              </div>
              <LimitSummaryList items={summary} loading={loading} limits={limits} onChanged={refresh} />
            </div>

            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Recent activity</h2>
                <span className="font-mono text-[11px] text-muted">{activities.length} records</span>
              </div>
              <ActivityList activities={activities} limits={limits} onChanged={refresh} />
            </div>
          </section>
        </div>

        <footer className="mt-12 border-t border-hairline pt-6 text-xs text-muted">
          API: <code className="break-all font-mono">{import.meta.env.VITE_API_URL ?? 'http://localhost:4000'}</code>
        </footer>
      </main>
    </div>
  );
}
