# mahendrarao.com

Personal site + "Knowledge Park 101" learning hub. Astro, static, hosted free on Cloudflare.

## Run locally
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Add a new article
Create `src/content/learn/<slug>.md` with this front-matter, then write in Markdown:
```yaml
---
title: "..."
description: "..."
topic: "Bash"      # groups it on /learn
order: 2           # reading order
level: "Beginner"
minutes: 15
date: 2026-10-20
free: true
draft: false       # true = hidden from site
---
```
Push to `main`; Cloudflare rebuilds automatically.

## Settings
Email, Topmate link, YouTube link: `src/config.ts`.

> Repo is public. Never commit passwords, tokens or personal notes.
