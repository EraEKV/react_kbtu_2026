# Game Vault — Task 6 (Server data, caching & Firebase Auth)

React + React Router app (continuation of Task 5) with TanStack Query caching and Firebase Authentication.
All previous features are kept: routes, search, filters, sorting, pagination (in the URL), dashboard, create / edit / delete.

- Live: _add the deployed link here_
- Stack: React 19, React Router 8, TanStack Query 5, Firebase Auth 13, Vite

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your Firebase web-app config
npm run dev
```

Firebase setup: create a project → Authentication → Sign-in method → enable **Email/Password** and **Google**
→ add a Web app and copy its config into `.env.local`. For a deployed site, add its domain in
Authentication → Settings → Authorized domains, and set the same `VITE_FIREBASE_*` variables in the hosting dashboard.
`.env.local` is git-ignored; `.env.example` lists every required variable.

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/`, `/about` | public | home, about |
| `/games`, `/games/:id`, `/games/new`, `/games/:id/edit` | public | list (search, filters, sort, pagination), details, create, edit |
| `/dashboard` | public | statistics |
| `/login` | public | email/password + Google sign-in |
| `/signup` | public | email, password, confirm password (validated) |
| `/profile` | **protected** | email, UID, logout. Guests are redirected to `/login` and returned after signing in |

The NavBar shows Login / Sign up for guests and Profile / Logout for signed-in users.

## Architecture

```
src/firebase.js              Firebase init from VITE_ env vars, persistent session
src/services/authService.js  all firebase/auth calls + readable error messages
src/context/AuthContext.jsx  AuthProvider + useAuth (onAuthStateChanged, loading, error)
src/services/service.js      fake REST API (localStorage + delay + random errors), supports AbortSignal
src/lib/queryClient.js       global cache settings
src/hooks/queryKeys.js       query keys
src/hooks/useGamesList.js    cached list query        src/hooks/useGame.js  cached details query
src/hooks/useGameMutations.js  create / update / delete + invalidation
```

UI components never touch `localStorage`, Firebase or the API directly; they use hooks and the auth context.

## Caching strategy

TanStack Query caches the games API.

**Query keys**
- list: `['games', 'list', '<query string>']`, so every combination of search / filters / sort / page is its own entry
- details: `['games', 'detail', '<id>']`

**Expiration / revalidation**
- `staleTime` = 1 minute. Cached data is used instantly (going back to a page, reopening a game) without a request.
- After 1 minute data is stale: it is still shown immediately, and refetched in the background when the component mounts again or the window regains focus.
- `gcTime` = 5 minutes. Entries nobody uses are removed from memory.
- Failed requests are retried once (not for "Item not found").

**Invalidation** (`useGameMutations.js`)
- **Create**: all `['games', ...]` queries are invalidated, so lists and the dashboard show the new game.
- **Update** (edit form, "Mark as completed"): the new game is written to `['games','detail',id]` right away, and all `['games', ...]` queries are invalidated (the game may move between filters or sort positions).
- **Delete**: all lists are invalidated and refetched; the deleted game's details entry is marked stale (without refetching, to avoid a "not found" flash before navigation), so opening that id again shows "not found".

**Outdated requests**
- Different query keys never share a result, so a slow response for an old filter cannot replace the newer one.
- Requests receive an `AbortSignal`; when a query becomes unused (the user changed the filter / page) the pending request is cancelled.

**States**: loading (skeletons / loader), error with "Try again", empty ("No games found"), not found.

## Authentication

- Email/Password sign-up (with validation), login, Google popup sign-in, logout.
- `onAuthStateChanged` keeps `user` in context; `loading` is true until the saved session is restored, so protected pages and the NavBar do not flicker.
- Persistence: `browserLocalPersistence`, so the session survives refresh and browser restart.
- Firebase errors are mapped to readable messages and shown on the forms.
