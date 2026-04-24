# WORK CONTEXT — blogo
> This file is auto-maintained by Gemini CLI. Do not edit manually unless necessary.
> Last updated: 2026-04-22

---

## 🗂 PROJECT OVERVIEW
- **Project Name:** blogo
- **Goal:** A personal developer blog platform with a built-in editor, GitHub authentication, and PWA support.
- **Key Tools / Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Editor.js, GitHub API.
- **Important Files / Paths:** 
  - `app/`: Main application routes and logic.
  - `components/`: Reusable UI components.
  - `lib/`: Utility functions and hooks (GitHub auth, database, post management).
  - `posts/`: Storage for blog post content (HTML and JSON).

---

## ⚠️ CRITICAL NOTES
> Put things here that must NEVER be forgotten across sessions.
- Project uses GitHub for authentication and potentially as a backend for post storage/syncing.
- PWA manifests and workers are present in the `public/` directory.

---

## 📋 ACTIVE TASKS
> Keep this section updated. Move completed tasks to the log below.

| Task | Status | Next Action |
|------|--------|-------------|
| Implement contributor verification system | ✅ DONE | Test the verification flow with different GitHub accounts. |

---

## 📝 SESSION LOG
> All work entries go here, newest at the top.

---
### [2026-04-24 10:50] — Fixed AuthGuard Blocking Callback

**What we did:**
Modified `components/Editor/AuthGuard.tsx` to explicitly allow the `/editor/auth/callback` path. Previously, the guard was intercepting the request before the callback handler could run, resulting in a silent failure where no code (or logs) ever executed.

**What was decided or found:**
Found that the "is authenticated" check in the `AuthGuard` was too aggressive and prevented the very component responsible for authenticating from rendering.

**Current status:** DONE ✅

**What to do next:**
The user should try logging in again. This time, the `CallbackHandler` should render, and logs/toasts should appear in the browser.

---
**What we did:**
Added granular logging to `CallbackHandler` and `useGitHubAuth.saveToken` to track the state transition after returning from GitHub.

**What was decided or found:**
Confirmed browser successfully redirects to GitHub and back, but the application fails to reflect the logged-in state.

**Current status:** IN PROGRESS 🔄

**What to do next:**
Analyze browser console logs to see if `saveToken` is called and if `AuthGuard` is causing a race condition.

---
**What we did:**
Added `toast.loading` and console logs to the `AuthCallbackPage` to track the "return trip" from GitHub. Added a log for the final redirect URL in `lib/useGitHubAuth.ts`.

**What was decided or found:**
Suspected the process might be failing silently after returning from GitHub or the redirect to GitHub is being blocked.

**Current status:** IN PROGRESS 🔄

**What to do next:**
Wait for user feedback on whether the browser actually redirects and if the callback page is reached.

---
**What we did:**
Modified `lib/useGitHubAuth.ts` to include `sonner` toasts within the `login` function. This provides immediate feedback if the environment variables are not correctly loaded on the client side.

**What was decided or found:**
Suspected that `NEXT_PUBLIC_GITHUB_CLIENT_ID` might be undefined on the client, causing the `login` function to return early without any visual feedback.

**Current status:** IN PROGRESS 🔄

**What to do next:**
The user should try clicking the login button again. If the "Configuration Error" toast appears, it means the environment variables need to be correctly exposed to the client (likely requiring a server restart).

---
**What we did:**
Updated `app/editor/auth/callback/page.tsx` to use `sonner` toasts for user feedback. Enhanced the fetch logic to properly catch and display specific error descriptions from the API response instead of generic failure messages.

**What was decided or found:**
Decided to use the existing `sonner` library (found in `package.json` and already configured in `RootLayout`) for consistent UI notifications.

**Current status:** DONE ✅

**What to do next:**
The user should try logging in again to see the specific error message in the toast, which will help diagnose any remaining issues.

---
**What we did:**
1. Added mandatory `User-Agent` headers to all GitHub API calls in `app/api/auth/github/callback/route.ts` and `lib/github.ts`.
2. Improved error handling and server-side logging in the GitHub OAuth callback route.
3. Updated `components/Editor/AuthGuard.tsx` to include a login button when unauthenticated and implemented the missing redirect to `/editor/unauthorized` for users without repository write permissions.
4. Verified environment variable names match between `.env.local` and the codebase.

**What was decided or found:**
Found that the GitHub API was likely failing due to missing `User-Agent` headers and that the `AuthGuard` was not properly enforcing authorization or providing a way to log in when triggered.

**Current status:** DONE ✅

**What to do next:**
Verify the fix by attempting a login. If it fails, check the server logs for `[Auth]` prefixed messages to identify the specific failure point.

---
### [2026-04-22 14:50] — Implemented Contributor Verification System

**What we did:**
Researched and implemented a tiered verification system for blog contributors. 
1. Added `checkUserPermission` to `lib/github.ts` to check repository collaborator status (admin/write).
2. Added `isUserWhitelisted` to `lib/github.ts` using a new `NEXT_PUBLIC_ALLOWED_USERS` environment variable.
3. Created `components/Editor/AuthGuard.tsx` to protect editor routes.
4. Created `app/editor/unauthorized/page.tsx` to handle unauthorized access and provide instructions for requesting access via GitHub Issues.
5. Integrated `AuthGuard` into `app/editor/layout.tsx`.

**What was decided or found:**
Decided on a dual-check system: an optional environment-based whitelist for immediate control and a mandatory GitHub repository permission check for security. This ensures only authorized collaborators can publish.

**Current status:** DONE ✅

**What to do next:**
Verify the redirect logic works as expected when a user without permissions logs in.

---
### [2026-04-22 14:35] — Discussing Contributor Verification System

**What we did:**
Switched from the `panel-8bit-cat` branch to the `main` branch and pulled the latest changes from the remote repository. This resulted in a fast-forward update of several files, including the creation of `components/PixelCat.tsx` and `components/PixelPanel.tsx`.

**What was decided or found:**
The project is now up to date with the latest upstream changes. New pixel-art style components have been introduced.

**Current status:** DONE ✅

**What to do next:**
Verify the project builds correctly after the update and investigate the implementation of the new `PixelCat` and `PixelPanel` components to understand their integration into the blog.
---
