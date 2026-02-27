const officalModelNames = ['kimi-k2.5'];

/**
 * getOfficalModels
 */
exports.getOfficalModels = () => {
  return officalModelNames.map((modelName) => {
    return {
      modelName: modelName,
      apiKey: '',
      baseURL: 'https://api.n1n.ai',
      modelID: modelName,
      modelThinking: 'enabled',
      platform: 'n1n',
      offical: true,
    };
  });
};
