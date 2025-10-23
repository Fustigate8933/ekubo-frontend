# GitHub Copilot Instructions

## Project Overview
- **Purpose**: Ekubo is a Japanese listening practice application designed to help users improve Japanese listening through music via a wordle-style process. The user listens to a song snippet and guesses the lyrics, receiving highlighted feedback on their guesses.
- **Tech Stack**: Nuxt 4, TypeScript, Tailwind CSS, NuxtUI

## Coding Standards

### General Guidelines
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful variable and function names
- Add JSDoc comments for complex functions

### Vue.js Specific
- Use Composition API with `<script setup>` syntax
- Keep components focused and under 200 lines
- Extract reusable logic into composables in `/composables`
- Use props for parent-child communication

### Styling
- Use Tailwind CSS utility classes
- Follow desktop-first responsive design
- Include mobile styles using Tailwind's responsive utilities if possible
- Maintain consistent spacing and color schemes

## Project Structure
/app
    /components # Reusable Vue components
    /pages # Nuxt pages
    /composables # Reusable logic
    /utils # Helper functions
    /types # TypeScript type definitions
/server
    /api # Server-side API routes
/tests # Unit and integration tests
/public # Static assets

## Testing Guidelines
- Write unit tests for utility functions
- Use Vitest for testing
- Aim for meaningful test coverage over arbitrary percentages
- Do not fix tests without understanding the root cause
- Do not delete tests just to pass checks

## Common Patterns

### API Calls
- Use composables for reusable API logic
- Ensure to handle loading and error states

### State Management
- Use Nuxt's useState for global state
- Use computed properties for derived states/refs

### API Integration
- Backend API base URL is configured in `nuxt.config.ts` via `runtimeConfig.public.apiBase`
- Use server-side API routes in `/server/api` as proxies to the backend
- use $fetch when for client-side event-driven actions like form submissions, button clicks, or any user-triggered requests since it doesn't automatically handle SSR payload transfer, which makes it ideal when you only want the request to happen in the browser.
- use useFetch for data that needs to be fetched during SSR and hydrated on the client side, such as data needed for initial page rendering.
- use useAsyncData for fetching data where more flexibility is required, such as when calling third-party SDKs, fetching multiple endpoints in parallel with Promise.all(), or transforming data before returning it.
- Follow the pattern for server route error handling: try-catch with `createError({ statusCode, statusMessage, data })` - use `statusMessage` and `data` rather than `message` for client-accessible error details

## Build and Development
- Run `pnpm run dev` for development server
- Run `pnpm run build` for production builds
- Run `pnpm run lint` before committing

## Important Notes
- Always review generated code for accuracy and adherence to standards

### Authentication
- Use JWT tokens stored in cookies with `sameSite: "strict"`
- Auth state managed via composables: `useAuthToken()`, `useUserData()`, `useLogin()`, `useSignup()`, `useLogout()`
- Protected routes use middleware in `/app/middleware`
- Always check for `userData.value?.id` before making authenticated requests

### Type Definitions
- Types are organized by domain: `/types/song.ts`, `/types/user.ts`, etc.
- Always import types from `/types/index.ts` for consistency

### Component Conventions
- Page components in `/app/pages` use kebab-case filenames
- Reusable components in `/app/components` use PascalCase
- Composables in `/app/composables` use camelCase with 'use' prefix
- Server routes follow RESTful conventions: `index.get.ts`, `index.post.ts`, `[id].get.ts`