# SpaceBooking

A coworking space booking application developed with Vue 3 and Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Environment Configuration

The application uses environment variables for configuration. The following files are used:

- `.env` - Default environment variables for all environments
- `.env.development` - Environment variables for development
- `.env.production` - Environment variables for production
- `.env.local` - Local overrides (not checked into version control)

Key environment variables:

- `VITE_API_BASE_URL` - Base URL for the API (e.g., 'https://api.ceylinco-works.com/api')
- `VITE_APP_TITLE` - Application title

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

The build process:
1. Automatically sets NODE_ENV to 'production'
2. Uses the `.env.production` configuration file
3. Optimizes and chunks the JavaScript for better performance
4. Outputs the build files to the `dist` directory

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Resilience & Outage Handling

See [`docs/resilience-guide.md`](docs/resilience-guide.md) for the incident playbook covering offline detection, the global error banner, and tips for communicating backend outages to end users.
