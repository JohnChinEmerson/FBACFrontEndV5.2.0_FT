# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Angular 13 front end ("Food and Beverage Web Accounting V5.2.0", Mariosoft) for an accounting/POS system. Uses Angular Material, ng-select, ngx-mask, ag-grid, Highcharts, SweetAlert2, ngx-toastr and Bootstrap 5 utility classes. TypeScript 4.6, RxJS 7.5.

## Commands

- `npm start` / `npm run serve` — dev server at http://localhost:4200 (runs `ng` with a 16 GB Node heap; the app is large and needs it)
- `npm run build` — dev build; `npm run build-production` — production build (swaps `environment.ts` for `environment.prod.ts`)
- `npm test` — Karma/Jasmine; single spec: `npx ng test --include='src/app/path/to/file.spec.ts'`
- No lint script is configured.

The backend API base URL is `environment.apiUrl` (`src/environments/environment*.ts`, dev default `http://127.0.0.1:8000/api/`), re-exported as `_url` from `src/global-variables.ts`, which also holds the system title strings.

## Architecture

- **Routing** (`src/app/app-routing.module.ts`, one large file): `''` validates the license → `landing` (login) → `home`, whose children are all feature pages with paths like `module/page_name`. `HomeComponent` is the shell (menus, layout); feature pages render in its outlet.
- **Feature layout** (`src/app/layouts/home/<Module>/<feature>-ui/`): modules such as Files, Inventory, Receiving, Sales, Cashiering, Accounting, Reports, AccessRights. Convention: a `*-ui` component is typically either a list page or a Material dialog (`MatDialog` + `MAT_DIALOG_DATA`) used for create/edit. Dialogs receive data as positional arrays (e.g. `[item, type, items]`) and are opened with `MatDialogConfig` from the parent component.
- **Services** (`src/app/services/<Module>/`, mirroring layouts): `providedIn: 'root'` HTTP wrappers around `_url + '<endpoint>'`. Mutating calls `.pipe(tap(() => this.requiredRefresh.next()))` on a `Subject`; components subscribe to `requiredRefresh` in `ngOnInit` to reload lists after saves. Components load data with `await firstValueFrom(service.getX())`.
- **Auth/session** (`auth.service.ts`): login data (session, branch, menus, access rights, etc.) is AES-encrypted with CryptoJS and kept in `localStorage`. Services build HTTP headers (`AuthBranchId`, `UserId`, `Edition`, `Token`) from `AuthService` when constructed, so the current branch and session are sent on every API call and the backend scopes data by branch.
- **Shared Material** imports live in `src/Material/Material.module.ts`; components are declared in `app.module.ts`.
- Print layouts are under `src/app/layouts/prints` and `src/app/prints`.
