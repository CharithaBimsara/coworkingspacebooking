# Frontend Resilience & Incident Playbook

This guide walks product, support, and engineering teammates through the new resiliency tooling that keeps the booking app usable when the API misbehaves or the browser goes offline.

## 1. How detection works

- **Online/offline listeners** are registered in `src/main.ts`. When the browser disconnects, we set `system.isOnline = false`, show the banner, and pause noisier retries.
- **Central error registry (`src/stores/system.ts`)** records the most recent API error. Any service can call `reportApiError` with `{ message, endpoint, statusCode }`.
- **UI surface (`src/components/NetworkStatusBanner.vue`)** renders a global banner for offline states or API failures. Errors are queued, so back-to-back failures are shown one at a time instead of overwhelming the user.
- **API helpers** (`src/api/networkManager.ts`, `src/api/bookingManager.ts`) catch HTTP failures and forward them to the system store so the UI always knows what went wrong.

## 2. What the user sees

1. **Offline** – Title switches to "You are currently offline" with guidance that bookings are paused until connection resumes.
2. **Server/API failure** – "We are having trouble reaching the servers" plus a "Show technical details" toggle. Endpoints, status codes, and timestamps only appear when the toggle is expanded, keeping sensitive URLs out of casual view while remaining available for support.
3. **Dismiss or auto-clear** – Users can hide the banner. Once service is healthy again, the next successful response clears the message automatically.

> Tip: copy is safe for end-users, but you can tailor the text in `NetworkStatusBanner.vue` if you want a branded tone.

## 3. Operator checklist during an outage

1. **Confirm the scope**  
   - Check the banner message (it shows the failing endpoint) and your API health dashboards.  
   - Use DevTools → Network to retry the failing request manually and capture the response body.
2. **Communicate**  
   - Post status updates in your incident channel.  
   - Optional: edit `system.reportApiError` to include a custom CTA (e.g. "Call support") for the current incident.
3. **Stabilize**  
   - If the backend is down for maintenance, return HTTP `503` with `Retry-After` so the frontend can back off.  
   - For known long-running outages, consider adding a `maintenanceMode` flag to the system store so the banner persists across reloads.
4. **Verify fix**  
   - Once the API is healthy, reload the page: the banner should disappear automatically.  
   - Re-run critical user flows (search, booking, payment) to ensure no additional errors are queued.

## 4. Customizing the experience

| Goal | Where to tweak |
| --- | --- |
| Change banner styling or tone | `src/components/NetworkStatusBanner.vue` |
| Inject product-specific fallback logic | `reportApiError` or `enqueueError` in `src/stores/system.ts` |
| Silence low-priority endpoints | Catch errors in the feature module and avoid forwarding to the system store |
| Add logging/telemetry | Extend `reportApiError` to call your analytics pipeline |
| Default technical toggle state | Adjust the `showTechnicalDetails` ref in `NetworkStatusBanner.vue` |

## 5. Testing the flows locally

- **Simulate offline**: In browser dev tools, toggle "Offline" in the Network tab. The banner should show instantly, and navigation should still succeed once you reconnect.
- **Simulate API errors**: Point `VITE_API_BASE_URL` to a mock server that returns 500s, or temporarily stop the backend. Watch the banner queue different endpoints.
- **Unit smoke test**: trigger `useSystemStore().reportApiError({ message: 'Forced failure', endpoint: '/api/test', timestamp: Date.now() })` inside any component setup block to preview the UI.

## 6. Future enhancements (nice-to-have)

- Persist the error queue in `localStorage` so the banner survives a reload when outages are ongoing.
- Pipe system-store updates to a toast/notification center for non-blocking warnings.
- Add a heartbeat endpoint check and auto-downgrade to a “read-only” mode when the API is degraded.

Keep this playbook handy to ensure users always understand the state of the system, even when the backend is down.
