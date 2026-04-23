# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Nuxt dev server on http://localhost:3000
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `npm run generate` — static generate
- `npm install` runs `nuxt prepare` via `postinstall`

There is no test runner, linter, or formatter wired into `package.json`.

## Backend / environment

- Frontend-only Nuxt 4 SPA (`ssr: false`) that talks to an external ASP.NET backend.
- Backend base URL is configured by env vars consumed in `nuxt.config.ts`:
  - `NUXT_PUBLIC_API_HOST` (default `http://localhost:5000`) — used as default `baseURL` for direct requests in `utils/requestHelper.ts`.
  - `NUXT_PUBLIC_API_BASE` (default `https://localhost:44329`) — also used by the Nitro dev proxy at `/api → https://localhost:44329` (with `secure: false` for self-signed certs and `ws: true` for SignalR).
- Real-time features use `@microsoft/signalr` against the same backend (chat + notifications).

## Architecture

### Routing & layouts
- File-based routes under `pages/`. Public pages (`index.vue`, `hotels/`, `login.vue`, `register.vue`, `hotel-search-result/`, etc.) use the `default` layout.
- Authenticated user area lives under `pages/user-info/`, `pages/reservation/`, `pages/favourite-hotels/`, `pages/payment/`, `pages/booking/`, `pages/feedback/`.
- Admin/manager area lives under `pages/admin/` with the `admin` layout and uses `middleware/admin.ts`.
- `middleware/auth.ts` and `middleware/admin.ts` are currently identical: both call `authStore.initAuthFromCookie()` on the client, redirect unauthenticated users to `/login`, and redirect non-admin/non-manager users to `/`. Treat the "auth" middleware as also restricting to admin/manager — if you need a "logged-in any role" gate, you'll need to add a new middleware.

### Auth flow
- JWT lives in a `token` cookie (`utils/storageHelper.ts`, `js-cookie`).
- `plugins/auth.client.ts` runs `authStore.initAuthFromCookie()` once on client boot; middleware re-runs it before navigations.
- `stores/auth.ts` decodes the JWT (via `stores/entity/response/auth` → `jwt-decode`), tracks `isAuthenticated`, exposes `isAdmin` / `isManager` / `isAdminOrManager` based on the role claim from `constants/auth.ts` (`ROLE_CLAIM`).
- Login (`POST /Auth/login`) returns `{ token, expiration }`; cookie expiry is set from `expiration`. Logout clears state + cookie.

### API layer (important)
All HTTP traffic goes through one funnel:

1. Callers invoke `useApiStore().apiRequest<T>(payload)` (`stores/api.ts`).
2. `apiRequest` injects `Authorization: Bearer <token>` when `payload.auth === true`, strips `Content-Type` when `payload.data` is `FormData`, then either:
   - posts the payload to an internal `/api/call` endpoint when `payload.proxy === true` (server-side proxy pattern — the actual `/api/call` server route is not in the repo today; the codebase calls with `proxy: false` everywhere it matters), or
   - calls `utils/requestHelper.ts` directly, which uses `ofetch` with `baseURL = runtimeConfig.public.apiHost` and `credentials: "include"`.
3. `requestHelper` handles `FormData` (no `Content-Type`) and switches between `query` (GET) and `body` (others).

When adding a new API call: define a Pinia store, call `apiStore.apiRequest({ method, endpoint: "/Foo/bar", data, auth: true, proxy: false })`. Don't bypass it with raw `fetch`/`axios`.

### State (Pinia)
- All stores live under `stores/` and use the composition (`defineStore("name", () => { ... })`) style.
- `stores/api.ts` and `stores/auth.ts` are foundational; feature stores (`hotelList`, `searchStore`, `reservations`, `payments`, `favouriteHotels`, `notification`, `feedback`, `getRoom`, `cityList`, `facilityList`, `editUser`, `forgotPassword`) wrap a single domain.
- Admin stores live under `stores/admin/` (e.g. `hotels.ts`, `rooms.ts`, `users.ts`, `cities.ts`, `facilties.ts` — note the typo, kept as-is — `dashboard.ts`, `reservations.ts`, `room-type.ts`, `uploadImage.ts`, `auth.ts`, `layout.ts`).
- Request/response shapes are organized into:
  - `stores/interface/request/*` and `stores/interface/response/*` — TypeScript interfaces.
  - `stores/entity/request/*` and `stores/entity/response/*` — class wrappers with `.serialize()` / `.deserialize()` (e.g. `auth.UserRegister`, `auth.AuthToken`). Prefer this pattern when shaping payloads or decoding tokens, instead of doing it inline in stores.
- `pinia-plugin-persistedstate` is installed; check store definitions for opt-in persistence.

### Real-time (SignalR)
- `composables/useSignalR.ts` is a generic hub wrapper: builds a `HubConnection` with `accessTokenFactory: () => authStore.token`, automatic reconnect, handler dedup, and unmount cleanup. Returns `{ start, stop, on, off, invoke, send, isConnected, ... }`.
- Domain-specific hubs: `composables/useChatHub.ts`, `composables/useNotificationHub.ts`. Add new hubs the same way rather than instantiating `signalR` directly.

### UI stack
- PrimeVue 4 (`@primevue/themes`, `primeicons`) registered in `plugins/primevue.client.ts`. PrimeVue is in `build.transpile`.
- TailwindCSS 4 via `@tailwindcss/vite` plugin; main stylesheet is `assets/css/main.css`.
- Maps via `leaflet` + `@types/leaflet`, registered client-side in `plugins/leaflet.client.ts`.
- Charts via `chart.js` (admin dashboard).
- PDF export via `html2pdf.js`.
- Date handling: `dayjs` (registered in `plugins/dayjs.ts`), helpers in `utils/date.ts`.

### i18n
- `@nuxtjs/i18n` configured for `en` / `vi` with `strategy: "no_prefix"` and locale files in `i18n/locales/`.
- Browser detection via the `i18n_language` cookie (`detectBrowserLanguage`).

## Conventions to follow

- Stick to the `apiStore.apiRequest` funnel for HTTP — it's the single place auth headers and FormData handling live.
- Keep request/response types in `stores/interface/**` and entity classes in `stores/entity/**`; mirror the `request/response` split.
- Component areas are organized by domain (`components/admin`, `components/HotelDetail`, `components/Booking`, `components/reservation`, `components/user-info`, `components/forgot-password`, `components/favourite-hotels`, `components/shared`); place new feature components alongside their domain.
- Vietnamese comments are common in existing code — don't strip them when editing.
- Path alias `~`/`@` resolves to project root (Nuxt default), e.g. `import { useAuthStore } from "~/stores/auth"`.
