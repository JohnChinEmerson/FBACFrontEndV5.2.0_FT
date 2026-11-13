# Phase 1 — Branch server + local Laravel API

Goal: a terminal at the branch keeps taking orders and payments against the branch server with the internet unplugged. Switching is manual in this phase; automatic detection comes in Phase 2.

> ⚠️ Not for production yet: offline numbering and upload sync arrive in Phase 3. Test on a test branch; data entered offline in Phase 1 stays on the branch server.

## What changed in code

Backend (`FBACBackEndV5.2.0`):
| File | Change |
|---|---|
| `config/fbac.php` | New: `node` (`cloud`/`branch`), `branch_id`, `license_grace_days` |
| `app/Http/Controllers/HealthController.php` | New: `GET /api/health` (no auth) → `{status, node, branchId, db, serverTime}` |
| `routes/api.php` | Registers `/health` |
| `app/AppToolBox/Activator.php` | Branch node only: 5 s timeout on the activator call, caches the last good result, and uses it offline for `FBAC_LICENSE_GRACE_DAYS`. The cloud node behaves exactly as before. |
| `.env.example` | `FBAC_NODE`, `FBAC_BRANCH_ID`, `FBAC_LICENSE_GRACE_DAYS` |

Frontend (`FBACFrontEndV5.2.0`):
| File | Change |
|---|---|
| `src/assets/runtime-config.json` | New, per-deployment config (default = cloud, so behaviour is unchanged) |
| `src/app/services/Offline/runtime-config.service.ts` | Loads the config at startup (`APP_INITIALIZER`) |
| `src/app/services/Offline/api-target.service.ts` | Current target `cloud` / `local` (stored in `localStorage.ApiTarget`) |
| `src/app/services/Offline/api-base.interceptor.ts` | Rewrites the `_url` prefix to the active backend |
| `src/app/app.module.ts` | Registers the initializer and the interceptor |

## Branch server setup

1. **Machine**: a Windows PC on the branch LAN with a fixed IP and a hostname such as `fbac-branch`.
2. **Software**: Apache + PHP (same version as the cloud) + MySQL/MariaDB **of the same major version as the cloud**. Check the cloud with `SELECT VERSION();`. Laragon or XAMPP is fine.
3. **Database** (test copy for now; Phase 4 replaces this with a proper pull):
   ```bash
   mysqldump -h <cloud-host> -u <user> -p --single-transaction --routines --triggers mariosoft_fbac_v5_2 > fbac.sql
   mysql -u root -p -e "CREATE DATABASE mariosoft_fbac_v5_2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
   mysql -u root -p mariosoft_fbac_v5_2 < fbac.sql
   ```
4. **Backend**: deploy the same git revision as the cloud, then `composer install --no-dev`. `.env`:
   ```ini
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=            # php artisan key:generate
   DB_HOST=127.0.0.1
   DB_DATABASE=mariosoft_fbac_v5_2
   DB_USERNAME=fbac_local
   DB_PASSWORD=...
   FBAC_NODE=branch
   FBAC_BRANCH_ID=<this branch's BranchId>
   FBAC_LICENSE_GRACE_DAYS=7
   ```
   Then run `php artisan config:cache`.
5. **Frontend**: `npm run build-production`, then copy `dist/rac-front-end-V5.2.0/*` to the web root.
   Edit **only** `assets/runtime-config.json` on the branch server:
   ```json
   {
     "node": "branch",
     "cloudApiUrl": "https://mariosoftacctng.com/api/",
     "localApiUrl": "http://fbac-branch:8080/api/"
   }
   ```
6. **Apache** (example):
   ```apache
   Listen 8080
   # Angular app
   <VirtualHost *:80>
     DocumentRoot "C:/fbac/web"
     <Directory "C:/fbac/web">
       RewriteEngine On
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule ^ index.html [L]
       Require ip 192.168.1      # branch subnet only
     </Directory>
   </VirtualHost>
   # Laravel API
   <VirtualHost *:8080>
     DocumentRoot "C:/fbac/api/public"
     <Directory "C:/fbac/api/public">
       AllowOverride All
       Require ip 192.168.1
     </Directory>
   </VirtualHost>
   ```
   The rewrite is required because the app uses path routing (no `#`).
7. **License warm-up**: with the internet **on**, open the app once and log in. This stores the activation in the branch server's cache. Without it, the first offline start fails the license check.

## Test steps

| # | Step | Expected |
|---|---|---|
| 1 | Cloud deployment (no change to `runtime-config.json`) → use the app normally, DevTools → Network | All calls still go to `environment.apiUrl`. Nothing changed. |
| 2 | `curl http://fbac-branch:8080/api/health` | `"node":"branch","db":"ok"` |
| 3 | Terminal opens `http://fbac-branch/`, logs in | Calls go to the **cloud** (default target) |
| 4 | DevTools console: `localStorage.setItem('ApiTarget','local'); location.reload()` | Calls now go to `fbac-branch:8080` |
| 5 | **Unplug the branch internet** (router WAN cable). Reload, log in, take a dine-in order, send to kitchen | License screen passes; login works; order slips route to the right printers (PrinterItems) |
| 6 | Bill out with a discount and a VAT-exempt item, pay, open/close drawer (including after-midnight cutoff) | VAT and totals match the cloud for the same items; drawer cutoff date is correct |
| 7 | Dynamic menu buttons | Same menus as online (from the local copy) |
| 8 | Change the branch server clock forward 8 days, reload, log in | License check fails after the grace period (expected); restore the clock |
| 9 | Reconnect internet, `localStorage.setItem('ApiTarget','cloud'); location.reload()` | Calls go back to the cloud |

## Known gaps (fixed in later phases)
- Item photos and logos use `_url + 'img/...'` directly and still point at the cloud, so they are broken offline (Phase 2 helper + Phase 4 image mirror).
- Numbers come from the per-branch `ControlNumbers` on the local copy and can duplicate cloud numbers (Phase 3).
- No upload of offline data yet (Phase 3).
- `Authentication` middleware does not validate `Token`. Fix this before exposing the branch API (see ARCHITECTURE.md › Security).
- Unrelated existing issue: `php artisan route:list` fails because `App\Http\Controllers\Files\SubItemsUI` does not exist.
