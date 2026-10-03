---
name: website-cloner
description: "Agentic workflow for cloning websites with pixel-perfect fidelity using specialized sub-agents. Use when the user wants to clone/copy/replicate a website, create a landing page based on an existing site, or needs to extract and recreate a website's design. Includes orchestration via slash command, four specialized sub-agents (screenshotter, extractor, cloner, qa-reviewer), and outputs React components with Tailwind CSS and motion animations."
---

# Website Cloner Skill

Clone any website with pixel-perfect fidelity using an orchestrated multi-agent workflow.

## Overview
This skill provides a complete system for cloning websites:
- Slash command: `/clone-website <url>` orchestrates the entire workflow
- 4 specialized sub-agents: Each handles a specific phase
- Output: Single React component using Tailwind CSS + motion

## Architecture

```text
┌─────────────────────────────────────────┐
│     ORCHESTRATOR (/clone-website)       │
│     Delegates, doesn't code             │
└─────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│ screen- │   │ extrac- │   │  (can   │
│ shotter │   │  tor    │   │ parallel│
└─────────┘   └─────────┘   └─────────┘
                    │
                    ▼
            ┌─────────────┐
            │   cloner    │◄────────┐
            └─────────────┘         │
                    │               │
                    ▼               │
            ┌─────────────┐         │
            │ qa-reviewer │─────────┘
            └─────────────┘  (loop until done)
```

## Quick Setup

### 1. Create Sub-Agents
Run `/agents` and create these 4 agents:

| Agent Name | Description Summary |
|------------|---------------------|
| `website-screenshotter` | Captures comprehensive screenshots (full-page, sections, components, hover states) |
| `website-extractor` | Downloads assets to `public/`, extracts colors, typography, spacing, animations |
| `website-cloner` | Implements React component with Tailwind + motion, auto-detects project type |
| `website-qa-reviewer` | Pixel-by-pixel comparison, classifies issues as Critical/Major/Minor |

### 2. Configure Browser / Playwright MCP
Ensure Puppeteer or Playwright MCP is configured in `mcp_config.json`:

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

## Usage

```bash
/clone-website https://example.com
```

### Orchestrator Workflow:
1. Create task folder `.tasks/clone-{domain}/`
2. Invoke `screenshotter` → captures all visual references
3. Invoke `extractor` → downloads assets, extracts styles
4. Invoke `cloner` → implements React component
5. Invoke `qa-reviewer` → finds discrepancies
6. Loop steps 4-5 until PERFECT or max 5 iterations

## Output Structure

```text
your-project/
├── public/
│   ├── images/          # Downloaded images
│   ├── videos/          # Downloaded videos
│   └── icons/           # Downloaded SVGs/icons
├── app/clone/page.tsx   # React component (location varies by framework)
└── .tasks/clone-{domain}/
    ├── context.md       # Extracted styles
    ├── screenshots/     # Visual references
    └── review-notes.md  # QA findings
```

## Tech Stack Decisions

| Technology | Reason |
|------------|--------|
| **Tailwind CSS** | Arbitrary values (`bg-[#hex]`) enable pixel-perfect color matching |
| **motion** | Modern, lighter alternative to framer-motion (import from `motion/react`) |
| **Single component** | Focus on cloning, not architecture; sections divided by comments |
| **Auto-detect framework** | Supports Next.js, TanStack Start, Vite, etc. |

## Workflow Details
- **Phase 1: Visual Capture** — capture full-length viewport and component screenshots
- **Phase 2: Asset & Style Extraction** — scrape fonts, colors, SVGs, images
- **Phase 3: Code Generation** — synthesize Tailwind + motion React component
- **Phase 4: QA & Refinement** — overlay screenshot comparison and iterate on discrepancies

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Sub-agents not found | Verify names match: `website-screenshotter`, `website-extractor`, `website-cloner`, `website-qa-reviewer` |
| Browser errors | Ensure Puppeteer/Playwright MCP is active and running |
| Assets not loading | Check `public/` folder structure and image paths in component |
| Infinite loop | QA reviewer should set status; check `review-notes.md` for STATUS line |
