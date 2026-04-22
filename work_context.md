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
