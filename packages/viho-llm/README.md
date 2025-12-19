<p align="center">
  <img src="https://static-small.vincentqiao.com/viho/logo.png" alt="viho logo" width="200"/>
</p>

<h1 align="center">viho-llm</h1>

<p align="center">Utility library for working with Google Gemini AI, providing common tools and helpers for AI interactions.</p>

## Installation

```bash
npm install viho-llm
```

## Prerequisites

This library supports two ways to access Google Gemini AI:

1. **Google AI Studio (GeminiAPI)** - For personal development and prototyping
   - Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Vertex AI (GeminiVertex)** - For enterprise applications with advanced features
   - Requires a Google Cloud project with Vertex AI enabled
   - Supports context caching for cost optimization

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

### Streaming Example

Both GeminiAPI and GeminiVertex support streaming responses:

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

## License

MIT

## Author

uikoo9 <uikoo9@qq.com>

## Related Projects

- [viho](https://github.com/uikoo9/viho) - Main CLI tool for managing AI models

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/uikoo9/viho/issues).
