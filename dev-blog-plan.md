# 📝 Dev Blog PWA — Full Project Plan

> A local-first, GitHub-powered dev blog with an in-browser Editor.js CMS.
> Write locally → draft in IndexedDB → publish as HTML to GitHub → render in Next.js.

---

## 🗂️ Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Repository Structure](#4-repository-structure)
5. [Phase 1 — Blog Frontend](#5-phase-1--blog-frontend)
6. [Phase 2 — PWA Editor App](#6-phase-2--pwa-editor-app)
7. [Phase 3 — GitHub Publish Pipeline](#7-phase-3--github-publish-pipeline)
8. [Phase 4 — Polish & Launch](#8-phase-4--polish--launch)
9. [Data Schemas](#9-data-schemas)
10. [GitHub API Reference](#10-github-api-reference)
11. [Milestones & Timeline](#11-milestones--timeline)

---

## 1. Project Overview

### Concept

A personal dev blog with a **fully browser-based CMS**. No backend, no database, no third-party CMS service. Content is written in a PWA editor, saved as drafts in the browser's IndexedDB, and published by pushing HTML files directly to a GitHub repository via the GitHub Contents API. The Next.js blog frontend reads from that same repository.

### Core User Flows

```
DRAFT FLOW
User opens PWA → writes in Editor.js → auto-saved to IndexedDB → stays local

PUBLISH FLOW
User clicks Publish → Editor.js JSON → @editorjs/html → HTML string
→ GitHub Contents API → commit to repo → blog rebuilds → post is live

EDIT EXISTING FLOW
User opens published post → fetches HTML from GitHub → loads into PWA
→ edits → re-publishes (updates file via GitHub API)
```

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    PWA Editor                        │
│  ┌─────────────┐   ┌──────────┐   ┌──────────────┐  │
│  │  Editor.js  │ → │  Dexie   │   │ GitHub OAuth │  │
│  │  (blocks)   │   │  (drafts)│   │    (auth)    │  │
│  └─────────────┘   └──────────┘   └──────────────┘  │
│         │                                │           │
│         ▼                                ▼           │
│  @editorjs/html              GitHub Contents API     │
│  (JSON → HTML)                    (publish)          │
└─────────────────────────────────────────────────────┘
                              │
                              ▼
                    GitHub Repository
                   ┌──────────────────┐
                   │  /posts          │
                   │    my-post.html  │
                   │    my-post.json  │ ← metadata
                   └──────────────────┘
                              │
                     (Vercel / VPS deploy)
                              │
                              ▼
                   ┌──────────────────┐
                   │  Next.js Blog    │
                   │  /blog/[slug]    │
                   │  (SSG / ISR)     │
                   └──────────────────┘
```

---

## 3. Tech Stack

### Blog Frontend

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSG, ISR, file-based routing |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, accessible |
| Syntax highlighting | highlight.js (client-side) | Highlights HTML code blocks on render |
| Analytics | Umami (self-hosted) | Privacy-friendly, no cookies |
| Comments | Giscus | GitHub Discussions, zero infra |
| Search | Pagefind | Static, zero-cost, offline-capable |

### PWA Editor

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (same repo, `/editor` route) OR Vite + React | Keep it one repo or separate |
| Editor | Editor.js + official plugins | Block-based, clean JSON output |
| Local storage | Dexie.js (IndexedDB wrapper) | High limits, offline, reliable |
| HTML conversion | @editorjs/html | Official, maintained |
| PWA | next-pwa or Vite PWA plugin | Service worker + manifest |
| GitHub auth | GitHub OAuth App | Secure token exchange |

### Editor.js Plugins

```
@editorjs/header          — H1–H6 headings
@editorjs/paragraph       — Body text
@editorjs/code            — Code blocks
@editorjs/list            — Ordered & unordered lists
@editorjs/image           — Image upload (to GitHub or CDN)
@editorjs/quote           — Blockquotes
@editorjs/table           — Tables
@editorjs/delimiter       — Section breaks (---)
@editorjs/inline-code     — Inline `code` spans
@editorjs/link            — Hyperlinks with preview
```

---

## 4. Repository Structure

```
my-blog/
├── app/                        # Next.js App Router
│   ├── (blog)/
│   │   ├── page.tsx            # Home — latest posts
│   │   ├── blog/
│   │   │   ├── page.tsx        # Post listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Post detail
│   │   ├── about/page.tsx
│   │   └── projects/page.tsx
│   └── editor/                 # PWA Editor (same repo)
│       ├── page.tsx            # Editor home / draft list
│       ├── new/page.tsx        # New post editor
│       └── edit/[slug]/page.tsx
│
├── posts/                      # Published content (GitHub source of truth)
│   ├── my-first-post.html      # Rendered HTML content
│   ├── my-first-post.json      # Post metadata
│   └── ...
│
├── lib/
│   ├── posts.ts                # Read posts from /posts dir
│   ├── github.ts               # GitHub Contents API client
│   └── db.ts                   # Dexie.js schema & queries
│
├── components/
│   ├── PostCard.tsx
│   ├── PostContent.tsx         # Renders HTML safely
│   ├── Editor/
│   │   ├── EditorWrapper.tsx   # Editor.js React wrapper
│   │   ├── PublishModal.tsx    # Frontmatter form + publish
│   │   └── DraftList.tsx
│   └── ui/                     # shadcn components
│
├── public/
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
│
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 5. Phase 1 — Blog Frontend

**Goal:** A working, beautiful blog that reads HTML posts from `/posts`.

### Tasks

- [ ] Init Next.js 14 project with Tailwind + shadcn/ui
- [ ] Design system — typography, colors, dark mode
- [ ] `lib/posts.ts` — read all `.json` metadata files from `/posts`, sort by date
- [ ] `/blog` page — post listing with tags filter
- [ ] `/blog/[slug]` page — fetch `.html` file, render with `PostContent`
- [ ] `PostContent.tsx` — sanitize HTML with DOMPurify, inject into DOM
- [ ] highlight.js — auto-detect and highlight `<code>` blocks on mount
- [ ] `/about` and `/projects` pages
- [ ] Responsive design — mobile first
- [ ] RSS feed — `/feed.xml` route
- [ ] Sitemap — `sitemap.ts`
- [ ] Umami analytics snippet
- [ ] Giscus comments on post pages
- [ ] Deploy to Vercel or VPS with Docker + Nginx

### Key Implementation — PostContent Component

```tsx
// components/PostContent.tsx
'use client'
import { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'

export function PostContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement)
      })
    }
  }, [html])

  return (
    <div
      ref={ref}
      className="prose prose-neutral dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  )
}
```

---

## 6. Phase 2 — PWA Editor App

**Goal:** A browser-based editor where you write posts, with drafts auto-saved to IndexedDB.

### Tasks

- [ ] Set up Editor.js with all plugins in a React wrapper
- [ ] `lib/db.ts` — Dexie.js schema for drafts
- [ ] Auto-save on Editor.js `onChange` (debounced 1s)
- [ ] Draft list page — show all local drafts with title, last saved date
- [ ] New post page — blank editor + metadata form (title, slug, tags, description)
- [ ] Edit draft page — load from IndexedDB → populate editor
- [ ] Delete draft — with confirmation
- [ ] PWA config — manifest.json, service worker, offline support
- [ ] App install prompt (beforeinstallprompt)
- [ ] GitHub OAuth login flow (see Phase 3)

### Dexie Schema

```ts
// lib/db.ts
import Dexie, { Table } from 'dexie'

export interface Draft {
  id?: number
  slug: string
  title: string
  description: string
  tags: string[]
  editorData: object      // Raw Editor.js JSON
  status: 'draft' | 'published'
  createdAt: Date
  updatedAt: Date
}

class BlogDB extends Dexie {
  drafts!: Table<Draft>

  constructor() {
    super('BlogDB')
    this.version(1).stores({
      drafts: '++id, slug, status, updatedAt'
    })
  }
}

export const db = new BlogDB()
```

### Editor.js React Wrapper

```tsx
// components/Editor/EditorWrapper.tsx
'use client'
import { useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import { EDITOR_TOOLS } from './tools'   // all plugins config

export function EditorWrapper({ data, onChange }) {
  const editorRef = useRef<EditorJS | null>(null)
  const holderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return

    editorRef.current = new EditorJS({
      holder: holderRef.current,
      tools: EDITOR_TOOLS,
      data,
      onChange: async () => {
        const saved = await editorRef.current?.save()
        onChange(saved)
      }
    })

    return () => {
      editorRef.current?.destroy()
      editorRef.current = null
    }
  }, [])

  return <div ref={holderRef} className="min-h-screen" />
}
```

---

## 7. Phase 3 — GitHub Publish Pipeline

**Goal:** One-click publish that commits the post HTML + metadata JSON to the GitHub repo.

### GitHub OAuth Setup

1. Create a **GitHub OAuth App** at `github.com/settings/developers`
2. Set callback URL to `https://yourdomain.com/editor/auth/callback`
3. Exchange code for access token via a lightweight Next.js API route (keeps client secret server-side)
4. Store token in `sessionStorage` (cleared on tab close — intentional)

### GitHub Contents API

```ts
// lib/github.ts

const GITHUB_API = 'https://api.github.com'
const REPO = 'yourusername/your-blog-repo'
const BRANCH = 'main'

// Get file SHA (needed for updates)
async function getFileSHA(path: string, token: string) {
  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (res.status === 404) return null
  const data = await res.json()
  return data.sha
}

// Create or update a file
export async function publishFile(
  path: string,
  content: string,
  message: string,
  token: string
) {
  const sha = await getFileSHA(path, token)
  const body: any = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),  // base64
    branch: BRANCH
  }
  if (sha) body.sha = sha   // required for updates

  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}
```

### Publish Flow

```ts
// On "Publish" button click
async function handlePublish(draft: Draft, token: string) {
  // 1. Convert Editor.js JSON → HTML
  const edjsParser = edjsHTML()
  const htmlBlocks = edjsParser.parse(draft.editorData)
  const html = htmlBlocks.join('\n')

  // 2. Build metadata JSON
  const meta = {
    title: draft.title,
    slug: draft.slug,
    description: draft.description,
    tags: draft.tags,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // 3. Push both files to GitHub
  await publishFile(
    `posts/${draft.slug}.html`,
    html,
    `post: publish ${draft.slug}`,
    token
  )
  await publishFile(
    `posts/${draft.slug}.json`,
    JSON.stringify(meta, null, 2),
    `post: metadata ${draft.slug}`,
    token
  )

  // 4. Update local draft status
  await db.drafts.update(draft.id!, { status: 'published' })
}
```

---

## 8. Phase 4 — Polish & Launch

### SEO & Performance
- [ ] `<meta>` tags — title, description, og:image per post
- [ ] OG image generation — Next.js `ImageResponse` from post title
- [ ] Google Search Console setup
- [ ] Lighthouse score ≥ 90 on all metrics

### Content
- [ ] Write 3 launch posts before going live
  - Suggested: "How I built this blog", "Self-hosting RustFS", "Fine-tuning Gemma for Lao"
- [ ] Projects page with cards for each project
- [ ] About page with bio + contact

### Monitoring
- [ ] Umami dashboard — page views, referrers
- [ ] GitHub Actions — notify on failed deploys
- [ ] Uptime monitoring — UptimeRobot or self-hosted

### Newsletter (Optional)
- [ ] Listmonk (self-hosted) or ConvertKit free tier
- [ ] Subscribe form on blog homepage and post footer

---

## 9. Data Schemas

### Post Metadata (`/posts/[slug].json`)

```json
{
  "title": "Self-hosting RustFS on a VPS",
  "slug": "self-hosting-rustfs",
  "description": "A step-by-step guide to running RustFS as an S3-compatible object store.",
  "tags": ["devops", "self-hosting", "storage"],
  "publishedAt": "2026-04-06T10:00:00Z",
  "updatedAt": "2026-04-06T10:00:00Z",
  "coverImage": "/images/rustfs-cover.png"
}
```

### IndexedDB Draft Schema

```ts
{
  id: 1,                          // auto-increment
  slug: "self-hosting-rustfs",
  title: "Self-hosting RustFS on a VPS",
  description: "...",
  tags: ["devops", "self-hosting"],
  editorData: { /* Editor.js OutputData */ },
  status: "draft",                // "draft" | "published"
  createdAt: Date,
  updatedAt: Date
}
```

---

## 10. GitHub API Reference

| Action | Method | Endpoint |
|---|---|---|
| Get file (+ SHA) | GET | `/repos/{owner}/{repo}/contents/{path}` |
| Create file | PUT | `/repos/{owner}/{repo}/contents/{path}` |
| Update file | PUT | `/repos/{owner}/{repo}/contents/{path}` (with SHA) |
| Delete file | DELETE | `/repos/{owner}/{repo}/contents/{path}` (with SHA) |
| List directory | GET | `/repos/{owner}/{repo}/contents/{path}/` |

All requests require header: `Authorization: Bearer {token}`

Content must be **base64 encoded**: `btoa(unescape(encodeURIComponent(content)))`

---

## 11. Milestones & Timeline

| Week | Milestone | Deliverable |
|---|---|---|
| 1 | Project setup | Next.js init, Tailwind, shadcn, repo structure |
| 2 | Blog frontend | Post listing, post detail, about, projects pages |
| 3 | Editor skeleton | Editor.js working, auto-save to IndexedDB |
| 4 | Draft management | Draft list, edit, delete, metadata form |
| 5 | GitHub auth | OAuth flow, token storage |
| 6 | Publish pipeline | JSON→HTML, GitHub API push, update flow |
| 7 | PWA setup | Manifest, service worker, offline mode, install prompt |
| 8 | Polish & launch | SEO, OG images, 3 posts written, deploy |

---

## ✅ Definition of Done

- [ ] Can write a post in the PWA editor offline
- [ ] Draft auto-saves every second with no data loss on refresh
- [ ] Clicking Publish pushes HTML + JSON to GitHub within 3 seconds
- [ ] Blog rebuilds and post is live within 60 seconds of publish
- [ ] Blog scores ≥ 90 on Lighthouse (performance, SEO, accessibility)
- [ ] PWA is installable on desktop and mobile
- [ ] Works fully offline for drafts (publish requires connection)

---

*Generated: April 2026*
