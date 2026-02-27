# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Viho is a lightweight CLI tool for managing and interacting with multiple AI models. It's a monorepo containing two packages:

- **viho**: The CLI tool that provides user-facing commands for model management and AI interactions
- **viho-llm**: Core library providing multi-provider LLM integration (OpenAI, Google Gemini API/Vertex)

## Essential Commands

### Building

```bash
npm run build           # Build all packages using Lerna
lerna run build        # Alternative direct Lerna command
```

### Linting & Testing

```bash
npm run lint           # Full pipeline: build + prettier + eslint + test
npm run prettier       # Format code with prettier
npm run eslint        # Lint code with eslint
npm run test          # Run tests across all packages
```

### Package Management

```bash
npm run check         # Check for package updates across monorepo
npm run update        # Update all packages to latest versions
npm run pkg ./packages           # Package packages for production
npm run dpkg ./packages dev      # Package packages for development
```

### Publishing

```bash
npm run cz            # Create conventional commit using commitizen
npm run pb            # Publish packages via Lerna (main branch only)
```

### Dependency Graph

```bash
npm run graph         # Visualize package dependencies with Nx
```

## Architecture

### Monorepo Structure

This is a Lerna-managed monorepo with Nx for build orchestration:

- **Lerna**: Handles package versioning, publishing, and cross-package operations
- **Nx**: Provides build caching and intelligent task scheduling based on dependency graph
- **Build order**: viho-llm must build before viho (viho depends on viho-llm)

### Package: viho-llm

Core abstraction layer for multiple LLM providers. Located in `packages/viho-llm/`.

**Key components:**

- `src/models/openai.js`: OpenAI and compatible APIs (DeepSeek, Kimi, etc.)
- `src/models/gemini-api.js`: Google Gemini via AI Studio
- `src/models/gemini-vertex.js`: Google Gemini via Vertex AI
- Each model exports a factory function that returns an object with `chat()` and `chatWithStreaming()` methods

**Build process:**

- Uses Rollup to bundle ESM source (`src/index.js`) to CommonJS (`index.js`)
- External dependencies: `@google/genai`, `qiao.log.js`
- Build output is specified in nx.json targets

**Provider API pattern:**

```javascript
// All providers follow this interface:
const provider = ProviderAPI(options);
await provider.chat(chatOptions);
await provider.chatWithStreaming(chatOptions, callbackOptions);
```

### Package: viho

CLI interface for interacting with AI models. Located in `packages/viho/`.

**Key structure:**

- `bin/viho.js`: Main entry point, loads all sub-commands
- `bin/viho-*.js`: Individual command implementations (model, ask, chat, expert, version)
- `src/`: Core business logic shared across commands
  - `model.js`: Model configuration management
  - `llm.js`: LLM interaction logic
  - `util.js`: Utilities including config initialization and logo display
  - `platforms.js`: Platform-specific configurations
  - `offical-models.js`: Official model definitions
  - `experts/`: Expert mode with pre-loaded documentation (antd, daisyui)

**Configuration:**

- Stored in `~/viho.json`
- Managed via `qiao-config` package
- Contains model definitions and default model selection

### Expert Mode

Expert mode provides domain-specific AI assistance by including pre-baked documentation as context:

- Documentation files in `packages/viho/src/experts/` (e.g., `antd.md`, `daisyui.md`)
- `experts.js` maps expert names to documentation files
- Enables more accurate answers for library-specific questions

## Development Workflow

### Git Hooks

Pre-commit hook (via husky + lint-staged) runs on all staged files:

1. Build all packages
2. Format with prettier
3. Lint with eslint
4. Run tests

This ensures all commits maintain code quality.

### Conventional Commits

Commits must follow conventional commit format (enforced by commitlint):

- Use `npm run cz` for interactive commit creation
- Format: `type(scope): subject`
- Examples: `feat(viho): add new command`, `fix(llm): resolve streaming issue`

### Publishing Workflow

1. Version bumps and publishing only allowed on `main` branch
2. Use `npm run pb` to publish (runs `lerna publish`)
3. Lerna automatically creates git tags and publishes to npm
4. Commit message: "chore(release): publish"

## Key Patterns

### Adding New AI Provider

To add a new provider to viho-llm:

1. Create `src/models/provider-name.js` with factory function
2. Implement `chat()` and `chatWithStreaming()` methods
3. Export from `src/index.js`
4. Update viho package to support new provider in platform selection

### Adding New CLI Command

To add a new command to viho:

1. Create `bin/viho-commandname.js`
2. Use `qiao-cli` to define command structure
3. Add business logic to `src/` if shared
4. Require the command file in `bin/viho.js`

### Working with Config

Configuration is managed through the `qiao-config` package:

- Config file location: `~/viho.json`
- Use utility functions in `src/util.js` for config operations
- Always validate config structure after modifications
