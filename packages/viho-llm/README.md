<p align="center">
  <img src="https://static-small.vincentqiao.com/viho/logo.png" alt="viho logo" width="200"/>
</p>

<h1 align="center">viho-llm</h1>

<p align="center">Multi-provider LLM library supporting Google Gemini and OpenAI compatible APIs.</p>

## Installation

```bash
npm install viho-llm
```

## Providers

### GeminiAPI

Google AI Studio:

```javascript
import { GeminiAPI } from 'viho-llm';

const gemini = GeminiAPI({
  apiKey: 'your-api-key',
  modelName: 'gemini-pro',
});

const response = await gemini.chat({
  contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
});
```

### GeminiVertex

Google Vertex AI with context caching support:

```javascript
import { GeminiVertex } from 'viho-llm';

const gemini = GeminiVertex({
  projectId: 'your-project-id',
  location: 'us-east1',
  modelName: 'gemini-1.5-flash-002',
});

// Chat
const response = await gemini.chat({
  contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
});

// Context caching (Vertex only)
await gemini.cacheAdd({
  gsPath: 'gs://bucket/file.pdf',
  systemPrompt: '...',
  cacheName: 'my-cache',
  cacheTTL: '3600s',
});
await gemini.cacheList();
await gemini.cacheUpdate(cacheName, { ttl: '7200s' });
```

### OpenAIAPI

OpenAI and compatible APIs (DeepSeek, Kimi, etc.):

```javascript
import { OpenAIAPI } from 'viho-llm';

const openai = OpenAIAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.openai.com/v1',
});

const response = await openai.chat({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello' }],
});
```

## Streaming

All providers support streaming via `chatWithStreaming`:

```javascript
await openai.chatWithStreaming(
  {
    model: 'deepseek-reasoner',
    messages: [{ role: 'user', content: 'Hello' }],
  },
  {
    beginCallback: () => {},
    firstThinkingCallback: () => {}, // OpenAI only, for reasoning models
    thinkingCallback: (text) => {}, // OpenAI only
    firstContentCallback: () => {},
    contentCallback: (text) => process.stdout.write(text),
    endCallback: () => {},
    errorCallback: (err) => {},
  },
);
```

## Agents

Sequential agent runner with early break support:

```javascript
import { runAgents } from 'viho-llm';

await runAgents([
  {
    agentStartCallback: () => console.log('Agent 1 starting'),
    agentRequestOptions: { llm: openai, modelName: 'gpt-4o', messages: [...], isJson: false, thinking: null },
    agentEndCallback: (response, allResponses) => { console.log(response); return false; },
    agentBreakCallback: () => console.log('Breaking'),  // optional
  },
]);
```

- `agentEndCallback(response, allResponses)` — receives current response and all previous responses; returns truthy to break
- `agentBreakCallback` (optional) is called before breaking

## License

MIT

## Author

uikoo9 <uikoo9@qq.com>
