<p align="center">
  <img src="https://static-small.vincentqiao.com/viho/logo.png" alt="viho logo" width="200"/>
</p>

<h1 align="center">viho</h1>

<p align="center">A lightweight CLI tool for managing and interacting with AI models.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/viho"><img src="https://img.shields.io/npm/v/viho.svg" alt="npm version"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

## Features

- Multiple AI model management
- Interactive Q&A with streaming responses
- Continuous chat sessions for multi-turn conversations
- Support for thinking mode (enabled/disabled/auto)
- Configurable API endpoints (OpenAI, Anthropic, custom providers)
- Default model configuration
- Simple and intuitive CLI interface
- Persistent configuration storage

## Installation

Install globally via npm:

```bash
npm install -g viho
```

## Requirements

- Node.js >= 18.0.0

## Quick Start

1. Add your first AI model:

```bash
viho model add
```

2. Set it as default:

```bash
viho model default
```

3. Start asking questions:

```bash
viho ask
```

## Commands

### Model Management

#### `viho model add`

Add a new AI model configuration interactively.

You'll be prompted to enter:

- Model name (a custom identifier)
- API key
- Base URL (e.g., https://api.openai.com/v1)
- Model ID (e.g., gpt-4, claude-3-5-sonnet-20241022)
- Thinking mode (enabled/disabled/auto)

```bash
viho model add
```

#### `viho model list`

List all configured models:

```bash
viho model list
```

#### `viho model remove`

Remove a model configuration:

```bash
viho model remove
```

#### `viho model default`

Set a default model for chat sessions:

```bash
viho model default
```

### Ask

#### `viho ask [modelName]`

Ask a question to an AI model.

If no model name is provided, uses the default model:

```bash
viho ask
```

Or specify a model explicitly:

```bash
viho ask mymodel
```

The interface includes:

- Editor-based question input
- Streaming responses
- Visual thinking process (when enabled)
- Colored output for better readability

### Chat

#### `viho chat [modelName]`

Start a continuous chat session with an AI model for multi-turn conversations.

If no model name is provided, uses the default model:

```bash
viho chat
```

Or specify a model explicitly:

```bash
viho chat mymodel
```

The chat session runs in a loop, allowing you to ask multiple questions continuously without restarting the command. Each question uses the same model configuration but starts a fresh conversation context.

**Note:** The main difference between `viho ask` and `viho chat`:

- `viho ask` - Single question, exits after receiving the answer
- `viho chat` - Continuous loop, keeps asking for new questions until manually stopped (Ctrl+C)

## Configuration

Configuration is stored in `~/viho.json`. You can manage all settings through the CLI commands.

### Example Configuration Structure

```json
{
  "models": [
    {
      "modelName": "mymodel",
      "apiKey": "your-api-key",
      "baseURL": "https://api.openai.com/v1",
      "modelID": "gpt-4",
      "modelThinking": "auto"
    }
  ],
  "default": "mymodel"
}
```

## Supported Providers

viho works with any OpenAI-compatible API, including:

- OpenAI (GPT-4, GPT-3.5, etc.)
- Anthropic Claude (via compatible endpoints)
- Custom LLM providers with OpenAI-compatible APIs

## Examples

### Adding an OpenAI Model

```bash
viho model add
# Enter model name: gpt4
# Enter API key: sk-...
# Enter base URL: https://api.openai.com/v1
# Enter model ID: gpt-4
# Thinking mode: disabled
```

### Adding a Claude Model

```bash
viho model add
# Enter model name: claude
# Enter API key: your-anthropic-key
# Enter base URL: https://api.anthropic.com
# Enter model ID: claude-3-5-sonnet-20241022
# Thinking mode: auto
```

### Setting Up for First Use

```bash
# Add a model
viho model add

# Set it as default
viho model default

# Start asking questions
viho ask
```

## Dependencies

- [qiao-cli](https://www.npmjs.com/package/qiao-cli) - CLI utilities
- [qiao-config](https://www.npmjs.com/package/qiao-config) - Configuration management
- [qiao-llm](https://www.npmjs.com/package/qiao-llm) - LLM integration

## License

MIT

## Author

uikoo9 <uikoo9@qq.com>

## Issues

Report issues at: https://github.com/uikoo9/viho/issues

## Homepage

https://github.com/uikoo9/viho
