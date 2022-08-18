# GMose Frontend

[`ReactJS`](https://reactjs.org/) | [`Vite`](https://vitejs.dev/) | [`Mantine UI`](https://mantine.dev/)

## Environment Variables

Run `cp env-example .env` to generate env file.

(Optional) Run `cp env-example .env.development` for development's env.

## Installation

Run `npm i`

## CI/CD project installation

Run [`npm ci`](https://docs.npmjs.com/cli/v8/commands/npm-ci#description).

## Development server

Run `npm run dev` to start dev server. The app will reflect immediately if there are any changes of the source files.

## Coding convention

Run `npm run lint` to check lint and format.

Run `npm run lint--fix` to fix all "auto-fixable" issues.

## Build

Run `npm run build[:mode]` to build the project.

- Build [:mode](https://vitejs.dev/guide/env-and-mode.html#modes) is optional.
- By default, this command will apply environment variables from `.env` and exec. build for production.
- The build artifacts will be stored in the `dist/` directory.

Run `npm run preview` to preview lastest build on local.

## Note

`package-lock.json` is ignored due to current CI/CD configuration.
In case your team need to/is required to archive one of those [various purposes](https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json#description) of `package-lock.json`, there are several suggested ways to achieve it:

- Share this file to others members manually.
- Update `.gitignore` to allow this file to be committed into source repositories, then update CI/CD configuration to adapt with it.
