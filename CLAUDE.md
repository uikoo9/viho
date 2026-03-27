# CLAUDE.md

## Project Overview

Viho is a lightweight CLI tool for managing and interacting with multiple AI models. Lerna + Nx monorepo with three packages:

- **viho**: CLI tool (`bin/viho.js` entry point, sub-commands: login, model, ask, chat, expert, version)
- **viho-llm**: Core LLM library (OpenAI, Gemini API, Gemini Vertex, LibLib AI), Rollup bundles ESM → CJS
- **viho-index**: Frontend/index page

## Mandatory Rules

- Proposals
  - When making proposals or technical decisions,
  - must rely on trustworthy data sources, such as official documentation
  - if no reliable data source or documentation is available, ask the user
  - it is acceptable to say "I don't know" in such cases
- Modifications
  - When modifying code,
  - must first list out the changes to be made,
  - only proceed after the user confirms
- Commits
  - When committing code,
  - must first pull the latest code,
  - then run `npm run lint` and only continue if there are no errors
  - write commit messages based on the diff summary
  - only then commit
- Push
  - When pushing code,
  - must confirm with the user before pushing
  - only proceed after confirmation

## Commands

```bash
npm run build       # Build all packages
npm run lint        # Build + prettier + eslint + test
npm run cz          # Conventional commit (commitizen)
npm run pb          # Publish via Lerna (main branch only)
```

## Architecture

- **Build order**: viho-llm → viho (dependency)
- **Config**: `~/viho.json` via `qiao-config`
- **Provider pattern**: factory function returning `{ chat(), chatWithStreaming() }`, files split as `provider.js` + `provider-util.js`
- **Platforms**: OpenAI-compatible (openai, deepseek, doubao, kimi, n1n) all route through `OpenAIAPI`
- **Expert mode**: `packages/viho/src/experts/*.md` loaded as system prompts

## Conventions

- Conventional commits: `type(scope): subject`
- Pre-commit hook: build → prettier → eslint → test
