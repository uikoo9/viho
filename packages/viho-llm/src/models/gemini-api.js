// gemini
import { GoogleGenAI } from '@google/genai';

// util
import { chat, chatWithStreaming } from './gemini-util.js';

// Logger
import { Logger } from 'qiao.log.js';
const logger = Logger('gemini-api.js');

/**
 * GeminiAPI
 * @param {*} options
 * @returns
 */
export const GeminiAPI = (options) => {
  const methodName = 'GeminiAPI';

  // check
  if (!options) {
    logger.error(methodName, 'need options');
    return;
  }
  if (!options.apiKey) {
    logger.error(methodName, 'need options.apiKey');
    return;
  }
  if (!options.modelName) {
    logger.error(methodName, 'need options.modelName');
    return;
  }

  // gemini
  const gemini = {};
  gemini.client = new GoogleGenAI({
    apiKey: options.apiKey,
  });

  // chat
  gemini.chat = async (chatOptions) => {
    return await chat(gemini.client, options.modelName, chatOptions);
  };
  gemini.chatWithStreaming = async (chatOptions, callbackOptions) => {
    return await chatWithStreaming(gemini.client, options.modelName, chatOptions, callbackOptions);
  };

  // r
  return gemini;
};
