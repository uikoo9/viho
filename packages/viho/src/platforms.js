// platforms
const openAIPlatforms = ['openai'];
const geminiPlatforms = ['gemini api', 'gemini vertex'];
const otherPlatforms = ['deepseek', 'doubao', 'kimi'];
const officalPlatform = 'n1n';

/**
 * getALLPlatforms
 * @returns
 */
exports.getALLPlatforms = () => {
  return [...openAIPlatforms, ...geminiPlatforms, ...otherPlatforms];
};

/**
 * getOpenAIPlatforms
 * @returns
 */
exports.getOpenAIPlatforms = () => {
  return [...openAIPlatforms, ...otherPlatforms, officalPlatform];
};

/**
 * getGeminiPlatforms
 * @returns
 */
exports.getGeminiPlatforms = () => {
  return geminiPlatforms;
};
