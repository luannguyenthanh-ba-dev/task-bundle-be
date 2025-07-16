# Project Setup

## Node Version
- Node.js 20

## Scripts
- Start source in development mode:
  ```bash
  npm run start:dev
  ```
- Start source in production mode:
  ```bash
  npm run start:prod
  ```
- Run ESLint:
  ```bash
  npm run lint
  ```

## Environment Configuration
- The `.env` file controls which environment is active.  
  For example, in `.env`:
  ```
  environment = develop
  ```

- The `/environments/xxx.env` files store the environment-specific variables.  
  For example:
  ```
  /environments/develop.env
  ```