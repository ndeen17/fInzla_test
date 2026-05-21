# Finzla Category Limits — Frontend

React + Vite + TypeScript + Tailwind frontend for the Finzla Category Limits
technical test. Pairs with the backend at
[ndeen17/fizlabe](https://github.com/ndeen17/fizlabe).

The submission write-up (assumptions, decisions, failure scenario, full API
docs) lives in the parent repo: see [`SUBMISSION.md`](../SUBMISSION.md).

## Stack

- React 18 + Vite 5 + TypeScript 5
- Tailwind 3 for styling (utility-first, no UI library)
- axios for HTTP
- Vitest + React Testing Library + user-event for tests

## Setup

Prerequisites: Node.js 20 or newer. A running backend (locally or on Render).

```bash
npm install
cp .env.example .env   # set VITE_API_URL if your backend isn't on :4000
npm run dev
```

The app serves on http://localhost:5173 and reads the backend base URL from
`VITE_API_URL` (defaults to `http://localhost:4000`).

## Scripts

| Script          | Purpose                                  |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Vite dev server with HMR                 |
| `npm run build` | Type-check (`tsc -b`) + production build |
| `npm run preview` | Preview the production build             |
| `npm test`      | Run the Vitest suite once                |

## What the app does

One screen with three regions:

1. **Create-limit form** — name + amount, validated client-side, posts to
   `POST /limits`.
2. **Summary cards** — one per category, with a status pill (On Track /
   Warning / Exceeded) and a progress bar coloured by status. Each card has
   **Edit** and **Delete** buttons that open a modal dialog; deleting a
   category cascades to its activities on the backend.
3. **Activities table** — recent activity log with **Edit** and **Delete**
   per row.

After any successful mutation, the app refetches `/limits`, `/activities`,
and `/limit-summary` in parallel so the UI stays consistent.

## Project layout

```
src/
  api/client.ts            axios wrapper, one function per endpoint
  components/
    Modal.tsx              ESC + click-outside + body scroll lock
    ConfirmDialog.tsx      destructive action wrapper around Modal
    LimitForm.tsx          create-limit form
    EditLimitForm.tsx      edit-limit form
    EditActivityForm.tsx   edit-activity form
    LimitSummaryList.tsx   summary cards + edit/delete actions
    ActivityList.tsx       activities table + edit/delete actions
    StatusBadge.tsx        On Track / Warning / Exceeded pill
  lib/status.ts            pure status-from-percentage helper
  App.tsx                  state + data loading + composition
  main.tsx                 entry point
```

## Tests

Eight tests across three files:

- `StatusBadge.test.tsx` — every status label and the Exceeded colour class.
- `LimitForm.test.tsx` — happy path (asserts axios payload and `onCreated`
  callback) and a validation error path.
- `LimitSummaryActions.test.tsx` — opens the delete confirm modal and
  asserts `deleteLimit()` + the refetch fire; opens the edit modal,
  asserts the amount input is prefilled, and asserts `updateLimit()` is
  called with the right payload.

Run with `npm test`.

## Deploy

Deployed to Vercel. Set `VITE_API_URL` in the project settings to the
Render backend URL before the first build.

## Out of scope

Authentication, multi-user, multi-currency / FX, pagination, optimistic UI
on edit/delete (currently refetches after every change), per-category
drill-down view, real-time updates.
