<p align="center">
  <img src="https://static-small.vincentqiao.com/viho/logo.png" alt="viho logo" width="200"/>
</p>

<h1 align="center">viho-llm</h1>

<p align="center">Utility library for working with multiple LLM providers (Google Gemini and OpenAI), providing common tools and helpers for AI interactions.</p>

## Installation

```bash
npm install viho-llm
```

## Prerequisites

This library supports multiple LLM providers:

### Google Gemini AI

1. **Google AI Studio (GeminiAPI)** - For personal development and prototyping
   - Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Vertex AI (GeminiVertex)** - For enterprise applications with advanced features
   - Requires a Google Cloud project with Vertex AI enabled
   - Supports context caching for cost optimization

### OpenAI Compatible APIs

**OpenAI API (OpenAIAPI)** - For OpenAI and compatible services

- Supports official OpenAI API
- Compatible with OpenAI-like APIs (e.g., DeepSeek, local LLMs)
- Supports thinking/reasoning mode for compatible models

## Usage

### Basic Example with GeminiAPI

Using Google AI Studio API Key (recommended for development):

```javascript
import { GeminiAPI } from 'viho-llm';

// Initialize Gemini client with API Key
const gemini = GeminiAPI({
  apiKey: 'your-google-api-key',
  modelName: 'gemini-pro',
});

// Send a chat message
const response = await gemini.chat({
  contents: [
    {
      role: 'user',
      parts: [{ text: 'Hello, how are you?' }],
    },
  ],
});

console.log(response);
```

### Basic Example with GeminiVertex

Using Vertex AI (recommended for production):

```javascript
import { GeminiVertex } from 'viho-llm';

// Initialize Gemini client with Vertex AI
const gemini = GeminiVertex({
  projectId: 'your-gcp-project-id',
  location: 'us-east1',
  modelName: 'gemini-pro',
});

// Send a chat message
const response = await gemini.chat({
  contents: [
    {
      role: 'user',
      parts: [{ text: 'Hello, how are you?' }],
    },
  ],
});

console.log(response);
```

### Basic Example with OpenAI API

Using OpenAI or OpenAI-compatible services:

```javascript
import { OpenAIAPI } from 'viho-llm';

// Initialize OpenAI client
const openai = OpenAIAPI({
  apiKey: 'your-openai-api-key',
  baseURL: 'https://api.openai.com/v1', // or your custom endpoint
});

// Send a chat message (using native OpenAI API format)
const response = await openai.chat({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, how are you?' },
  ],
});

console.log(response);
```

### Streaming Example

All providers (GeminiAPI, GeminiVertex, and OpenAIAPI) support streaming responses:

#### Gemini Streaming

```javascript
// Send a chat message with streaming
await gemini.chatWithStreaming(
  {
    contents: [
      {
        role: 'user',
        parts: [{ text: 'Write a long story about AI' }],
      },
    ],
  },
  {
    beginCallback: () => {
      console.log('Stream started...');
    },
    firstContentCallback: () => {
      console.log('First chunk received!');
    },
    contentCallback: (content) => {
      process.stdout.write(content); // Print each chunk as it arrives
    },
    endCallback: () => {
      console.log('\nStream ended.');
    },
    errorCallback: (error) => {
      console.error('Error:', error);
    },
  },
);
```

#### OpenAI Streaming with Thinking Mode

OpenAI streaming supports thinking/reasoning content for compatible models:

```javascript
// Send a chat message with streaming (supports thinking mode)
await openai.chatWithStreaming(
  {
    model: 'deepseek-reasoner',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Explain how neural networks work' },
    ],
    thinking: {
      type: 'enabled', // Enable reasoning mode
    },
  },
  {
    beginCallback: () => {
      console.log('Stream started...');
    },
    firstThinkingCallback: () => {
      console.log('\n[Thinking...]');
    },
    thinkingCallback: (thinking) => {
      process.stdout.write(thinking); // Print reasoning process
    },
    firstContentCallback: () => {
      console.log('\n[Response:]');
    },
    contentCallback: (content) => {
      process.stdout.write(content); // Print response content
    },
    endCallback: () => {
      console.log('\nStream ended.');
    },
    errorCallback: (error) => {
      console.error('Error:', error);
    },
  },
);
```

### Context Caching Example (Vertex AI Only)

GeminiVertex supports context caching to reduce costs and latency when using large contexts:

```javascript
import { GeminiVertex } from 'viho-llm';

const gemini = GeminiVertex({
  projectId: 'your-gcp-project-id',
  location: 'us-east1',
  modelName: 'gemini-1.5-flash-002',
});

// Add a new cache
const cache = await gemini.cacheAdd({
  gsPath: 'gs://your-bucket/large-document.pdf',
  systemPrompt: 'You are an expert at analyzing technical documents.',
  cacheName: 'my-document-cache',
  cacheTTL: '3600s', // 1 hour
});

console.log('Cache created:', cache.name);

// List all caches
const caches = await gemini.cacheList();
console.log('Available caches:', caches);

// Update cache TTL
await gemini.cacheUpdate(cache.name, {
  ttl: '7200s', // Extend to 2 hours
});
```

## API Reference

### `GeminiAPI(options)`

Creates a new Gemini client instance using Google AI Studio API.

#### Parameters

- `options` (Object) - Configuration options
  - `apiKey` (string) **required** - Your Google AI API key
  - `modelName` (string) **required** - Model name (e.g., 'gemini-pro', 'gemini-pro-vision')

#### Returns

Returns a Gemini client object with the following methods:

##### `client.chat(chatOptions)`

Sends a chat request to the Gemini API.

**Parameters:**

- `chatOptions` (Object)
  - `contents` (Array) **required** - Array of message objects
    - `role` (string) - Either 'user' or 'model'
    - `parts` (Array) - Array of content parts
      - `text` (string) - The text content

**Returns:**

- (Promise\<string\>) - The generated text response

**Example:**

```javascript
const response = await gemini.chat({
  contents: [
    {
      role: 'user',
      parts: [{ text: 'Write a haiku about coding' }],
    },
  ],
});
```

##### `client.chatWithStreaming(chatOptions, callbackOptions)`

Sends a chat request to the Gemini API with streaming response.

**Parameters:**

- `chatOptions` (Object)
  - `contents` (Array) **required** - Array of message objects
    - `role` (string) - Either 'user' or 'model'
    - `parts` (Array) - Array of content parts
      - `text` (string) - The text content

- `callbackOptions` (Object) - Callback functions for handling stream events
  - `beginCallback` (Function) - Called when the stream begins
  - `contentCallback` (Function) - Called for each content chunk received
    - Parameters: `content` (string) - The text chunk
  - `firstContentCallback` (Function) - Called when the first content chunk is received
  - `endCallback` (Function) - Called when the stream ends successfully
  - `errorCallback` (Function) - Called if an error occurs
    - Parameters: `error` (Error) - The error object

**Returns:**

- (Promise\<void\>) - Resolves when streaming completes

**Example:**

```javascript
await gemini.chatWithStreaming(
  {
    contents: [
      {
        role: 'user',
        parts: [{ text: 'Explain quantum computing' }],
      },
    ],
  },
  {
    contentCallback: (chunk) => {
      console.log('Received:', chunk);
    },
    endCallback: () => {
      console.log('Done!');
    },
  },
);
```

---

### `GeminiVertex(options)`

Creates a new Gemini client instance using Vertex AI. Includes all features of GeminiAPI plus context caching support.

#### Parameters

- `options` (Object) - Configuration options
  - `projectId` (string) **required** - Your Google Cloud project ID
  - `location` (string) **required** - GCP region (e.g., 'us-east1', 'us-central1')
  - `modelName` (string) **required** - Model name (e.g., 'gemini-1.5-flash-002', 'gemini-1.5-pro-002')

#### Returns

Returns a Gemini client object with the following methods:

##### `client.chat(chatOptions)`

Same as GeminiAPI.chat(). See above for details.

##### `client.chatWithStreaming(chatOptions, callbackOptions)`

Same as GeminiAPI.chatWithStreaming(). See above for details.

##### `client.cacheAdd(cacheOptions)`

Creates a new context cache for frequently used content.

**Parameters:**

- `cacheOptions` (Object)
  - `gsPath` (string) **required** - Google Cloud Storage path (e.g., 'gs://bucket/file.pdf')
  - `systemPrompt` (string) **required** - System instruction for the cached context
  - `cacheName` (string) **required** - Display name for the cache
  - `cacheTTL` (string) **required** - Time-to-live (e.g., '3600s' for 1 hour)

**Returns:**

- (Promise\<Object\>) - Cache object with name and metadata

**Example:**

```javascript
const cache = await gemini.cacheAdd({
  gsPath: 'gs://my-bucket/documentation.pdf',
  systemPrompt: 'You are a helpful documentation assistant.',
  cacheName: 'docs-cache',
  cacheTTL: '3600s',
});
```

##### `client.cacheList()`

Lists all available caches in the project.

**Parameters:** None

**Returns:**

- (Promise\<Array\>) - Array of cache objects with `name` and `displayName` properties

**Example:**

```javascript
const caches = await gemini.cacheList();
console.log(caches);
// [{ name: 'projects/.../cachedContents/...', displayName: 'docs-cache' }]
```

##### `client.cacheUpdate(cacheName, cacheOptions)`

Updates an existing cache configuration.

**Parameters:**

- `cacheName` (string) **required** - The cache name to update
- `cacheOptions` (Object) **required** - Update configuration
  - `ttl` (string) - New time-to-live value (e.g., '7200s')

**Returns:**

- (Promise\<Object\>) - Updated cache object

**Example:**

```javascript
await gemini.cacheUpdate('projects/.../cachedContents/abc123', {
  ttl: '7200s', // Extend to 2 hours
});
```

---

### `OpenAIAPI(options)`

Creates a new OpenAI client instance supporting OpenAI and compatible APIs.

#### Parameters

- `options` (Object) - Configuration options
  - `apiKey` (string) **required** - Your OpenAI API key or compatible service key
  - `baseURL` (string) **required** - API base URL (e.g., 'https://api.openai.com/v1')

#### Returns

Returns an OpenAI client object with the following methods:

##### `client.chat(chatOptions)`

Sends a chat request to the OpenAI API.

**Parameters:**

- `chatOptions` (Object) **required** - Native OpenAI API chat completion options
  - `model` (string) **required** - Model identifier (e.g., 'gpt-4o', 'deepseek-reasoner')
  - `messages` (Array) **required** - Array of message objects
    - `role` (string) - 'system', 'user', or 'assistant'
    - `content` (string) - Message content
  - `thinking` (Object) - Optional thinking/reasoning configuration
    - `type` (string) - 'enabled' or 'disabled'
  - ...other OpenAI API parameters

**Returns:**

- (Promise\<Object\>) - Message object with `role` and `content` properties

**Example:**

```javascript
const response = await openai.chat({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful coding assistant.' },
    { role: 'user', content: 'Write a Python function to reverse a string' },
  ],
});
console.log(response.content);
```

##### `client.chatWithStreaming(chatOptions, callbackOptions)`

Sends a chat request to the OpenAI API with streaming response and thinking support.

**Parameters:**

- `chatOptions` (Object) **required** - Native OpenAI API chat completion options
  - `model` (string) **required** - Model identifier (e.g., 'gpt-4o', 'deepseek-reasoner')
  - `messages` (Array) **required** - Array of message objects
    - `role` (string) - 'system', 'user', or 'assistant'
    - `content` (string) - Message content
  - `thinking` (Object) - Optional thinking/reasoning configuration
    - `type` (string) - 'enabled' or 'disabled'
  - ...other OpenAI API parameters (note: `stream` will be automatically set to `true`)

- `callbackOptions` (Object) **required** - Callback functions for handling stream events
  - `beginCallback` (Function) - Called when the stream begins
  - `firstThinkingCallback` (Function) - Called when the first thinking chunk is received (for reasoning models)
  - `thinkingCallback` (Function) - Called for each thinking/reasoning chunk received
    - Parameters: `thinking` (string) - The thinking content chunk
  - `firstContentCallback` (Function) - Called when the first response content chunk is received
  - `contentCallback` (Function) - Called for each response content chunk received
    - Parameters: `content` (string) - The text chunk
  - `endCallback` (Function) - Called when the stream ends successfully
  - `errorCallback` (Function) - Called if an error occurs
    - Parameters: `error` (Error) - The error object

**Returns:**

- (Promise\<void\>) - Resolves when streaming completes

**Example:**

```javascript
await openai.chatWithStreaming(
  {
    model: 'deepseek-reasoner',
    messages: [
      { role: 'system', content: 'You are a math tutor.' },
      { role: 'user', content: 'Solve: What is 15% of 240?' },
    ],
    thinking: {
      type: 'enabled',
    },
  },
  {
    thinkingCallback: (thinking) => {
      console.log('Thinking:', thinking);
    },
    contentCallback: (chunk) => {
      process.stdout.write(chunk);
    },
    endCallback: () => {
      console.log('\nDone!');
    },
  },
);
```

## License

MIT

## Author

uikoo9 <uikoo9@qq.com>

## Related Projects

- [viho](https://github.com/uikoo9/viho) - Main CLI tool for managing AI models

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/uikoo9/viho/issues).
