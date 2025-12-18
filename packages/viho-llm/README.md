# viho-llm

Utility library for working with Google Gemini AI, providing common tools and helpers for AI interactions.

## Installation

```bash
npm install viho-llm
```

## Prerequisites

You need to have a Google AI API key. Get one from [Google AI Studio](https://makersuite.google.com/app/apikey).

## Usage

### Basic Example

```javascript
import { Gemini } from 'viho-llm';

// Initialize Gemini client
const gemini = Gemini({
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

### Streaming Example

```javascript
import { Gemini } from 'viho-llm';

// Initialize Gemini client
const gemini = Gemini({
  apiKey: 'your-google-api-key',
  modelName: 'gemini-pro',
});

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

## API Reference

### `Gemini(options)`

Creates a new Gemini client instance.

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

## License

MIT

## Author

uikoo9 <uikoo9@qq.com>

## Related Projects

- [viho](https://github.com/uikoo9/viho) - Main CLI tool for managing AI models

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/uikoo9/viho/issues).
