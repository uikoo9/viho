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

- Multiple AI model management (OpenAI, Google Gemini)
- Support for OpenAI-compatible APIs
- Support for Google Gemini AI (API and Vertex AI)
- Interactive Q&A with streaming responses
- Continuous chat sessions for multi-turn conversations
- Support for thinking mode (for compatible models)
- Expert mode with domain-specific knowledge
- Configurable API endpoints
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

First, you'll select the model type:

- **openai** - For OpenAI and OpenAI-compatible APIs
- **gemini api** - For Google Gemini AI Studio
- **gemini vertex** - For Google Gemini Vertex AI

Then you'll be prompted to enter the required information based on the model type:

**For OpenAI:**

- Model name (a custom identifier)
- API key
- Base URL (e.g., https://api.openai.com/v1)
- Model ID (e.g., gpt-4, gpt-4o)
- Thinking mode (enabled/disabled)

**For Gemini API:**

- Model name (a custom identifier)
- API key (from Google AI Studio)
- Model ID (e.g., gemini-pro, gemini-1.5-flash, gemini-1.5-pro)

**For Gemini Vertex:**

- Model name (a custom identifier)
- Project ID (your GCP project)
- Location (e.g., us-east1, us-central1)
- Model ID (e.g., gemini-1.5-flash-002, gemini-1.5-pro-002)

```bash
viho model add
```

After adding a model, it will be available for use with `viho ask`, `viho chat`, and `viho expert` commands.

#### `viho model list`

List all configured models with detailed information.

```bash
viho model list
```

This command displays:

- Model name with a `(default)` tag for the default model
- Model type (openai, gemini api, or gemini vertex)
- Type-specific configuration details

**Example output:**

```
Configured models:

  • gpt4 (default)
    Type: openai
    Model ID: gpt-4o
    Base URL: https://api.openai.com/v1
    Thinking: enabled

  • gemini
    Type: gemini api
    Model ID: gemini-1.5-flash
    API Key: ***

  • gemini-pro
    Type: gemini vertex
    Model ID: gemini-1.5-pro-002
    Project ID: my-project-123
    Location: us-east1
```

#### `viho model remove`

Remove a model configuration:

```bash
viho model remove
```

You'll be prompted to enter the model name to remove. If the removed model was set as default, you'll need to set a new default model.

#### `viho model default`

Set a default model for chat and ask sessions:

```bash
viho model default
```

The default model will be used when you run `viho ask` or `viho chat` without specifying a model name.

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

### Expert Mode

Expert mode allows you to chat with an AI model that has access to domain-specific documentation, making it more knowledgeable about particular libraries or frameworks.

#### `viho expert list`

List all available expert resources:

```bash
viho expert list
```

This displays available experts like:

- `antd` - Ant Design documentation
- `daisyui` - DaisyUI documentation

#### `viho expert <name> [modelName]`

Start an expert chat session with domain-specific knowledge:

```bash
viho expert antd
```

Or specify a model explicitly:

```bash
viho expert daisyui mymodel
```

The expert mode works similarly to `viho chat` but includes the relevant documentation as context, making the AI more accurate when answering questions about that specific library or framework.

**Example:**

```bash
# Get help with Ant Design
viho expert antd

# Ask: "How do I create a responsive table with sorting?"
# The AI will use Ant Design documentation to provide accurate answers
```

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

viho supports multiple AI providers:

### OpenAI-Compatible APIs

- OpenAI (GPT-4, GPT-4o, GPT-3.5, etc.)
- Any OpenAI-compatible API endpoints
- Custom LLM providers with OpenAI-compatible APIs

### Google Gemini

- **Gemini API** (via Google AI Studio)
  - Ideal for personal development and prototyping
  - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

- **Gemini Vertex AI** (via Google Cloud)
  - Enterprise-grade with advanced features
  - Requires Google Cloud project with Vertex AI enabled
  - Supports context caching for cost optimization

## Examples

### Adding an OpenAI Model

```bash
viho model add
# Select model type: openai
# Enter model name: gpt4
# Enter API key: sk-...
# Enter base URL: https://api.openai.com/v1
# Enter model ID: gpt-4o
# Thinking mode: disabled
```

### Adding a Gemini API Model

```bash
viho model add
# Select model type: gemini api
# Enter model name: gemini
# Enter API key: your-google-ai-api-key
# Enter model ID: gemini-1.5-flash
```

### Adding a Gemini Vertex AI Model

```bash
viho model add
# Select model type: gemini vertex
# Enter model name: gemini-pro
# Enter projectId: my-gcp-project
# Enter location: us-east1
# Enter model ID: gemini-1.5-pro-002
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
- [qiao-file](https://www.npmjs.com/package/qiao-file) - File utilities
- [viho-llm](https://www.npmjs.com/package/viho-llm) - Multi-provider LLM integration (OpenAI, Gemini)

## License

MIT

## Author

uikoo9 <uikoo9@qq.com>

## Issues

Report issues at: https://github.com/uikoo9/viho/issues

## Homepage

https://github.com/uikoo9/viho
