const officalModelNames = [
  'gpt-5.2',
  'claude-sonnet-4-6',
  'claude-opus-4-6',
  'gemini-3.1-pro-preview',
  'grok-4.1',
  'doubao-seed-1-8-251228',
  'deepseek-v3.2',
  'qwen3.5-plus',
  'kimi-k2.5',
  'MiniMax-M2.5',
];

/**
 * getOfficalModels
 */
exports.getOfficalModels = () => {
  return officalModelNames.map((modelName) => {
    return {
      modelName: modelName,
      apiKey: '',
      baseURL: 'https://api.n1n.ai/v1',
      modelID: modelName,
      modelThinking: 'enabled',
      platform: 'n1n',
      offical: true,
    };
  });
};
