<p align="center">
  <img src="https://static-small.vincentqiao.com/viho/logo.png" alt="viho logo" width="200"/>
</p>

<h1 align="center">viho</h1>

<p align="center">A lightweight CLI tool for interacting with AI models.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/viho"><img src="https://img.shields.io/npm/v/viho.svg" alt="npm version"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

## Why viho?

**Traditional way to use AI models:**
Open browser → Navigate to website → Login → Ask questions

**With viho:**
Just type `viho ask` or `viho chat`

## Installation

### Quick Install (Recommended)

**Linux & macOS:**

```bash
curl -fsSL https://www.viho.fun/install.sh | sh
```

**Windows (PowerShell):**

```powershell
irm https://www.viho.fun/install.ps1 | iex
```

No Node.js required! The installer will download a standalone binary for your platform.

### Alternative: If you already have Node.js

```bash
npm install -g viho
```

**Requirements:** Node.js >= 18.0.0

## Use Your Own Models

Configure and use your own AI model API keys:

```bash
viho model add       # Add a new model configuration
viho model list      # List all configured models
viho model remove    # Remove a model
viho model default   # Set default model

# Then start using
viho ask             # Single question
viho chat            # Continuous conversation
```

**Supported platforms:** OpenAI, DeepSeek, Kimi, Doubao, Google Gemini (API & Vertex AI), and any OpenAI-compatible APIs.

## Use Official Models

Access premium AI models instantly without configuration:

```bash
viho login           # Login to https://n1n.ai/
viho model default   # Select an official model

# Then start using
viho ask             # Single question
viho chat            # Continuous conversation
```

### Available Official Models

- **gpt-5.2** - OpenAI GPT-5.2
- **claude-sonnet-4-6** - Anthropic Claude Sonnet 4.6
- **claude-opus-4-6** - Anthropic Claude Opus 4.6
- **gemini-3.1-pro-preview** - Google Gemini 3.1 Pro Preview
- **grok-4.1** - xAI Grok 4.1
- **doubao-seed-1-8-251228** - ByteDance Doubao Seed 1.8
- **deepseek-v3.2** - DeepSeek V3.2
- **qwen3.5-plus** - Alibaba Qwen 3.5 Plus
- **kimi-k2.5** - Moonshot Kimi K2.5
- **MiniMax-M2.5** - MiniMax M2.5

## Additional Features

### Expert Mode

Get domain-specific help with pre-loaded documentation:

```bash
viho expert list     # List available experts
viho expert antd     # Get help with Ant Design
viho expert daisyui  # Get help with DaisyUI
```

### Thinking Mode

For compatible models, enable thinking mode to see the AI's reasoning process:

```bash
# Enabled during model configuration
viho model add
# Select "enabled" for thinking mode
```

## Configuration

All settings are stored in `~/viho.json`. You can manage everything through the CLI commands.
