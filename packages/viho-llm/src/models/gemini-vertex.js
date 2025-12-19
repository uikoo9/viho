// gemini
import { GoogleGenAI } from '@google/genai';

// util
import { chat, chatWithStreaming, cacheAdd, cacheList } from './gemini-util.js';

// Logger
import { Logger } from 'qiao.log.js';
const logger = Logger('viho-llm');

/**
 * GeminiVertex
 * @param {*} options
 * @returns
 */
export const GeminiVertex = (options) => {
  const methodName = 'GeminiVertex';

  // check
  if (!options) {
    logger.error(methodName, 'need options');
    return;
  }
  if (!options.projectId) {
    logger.error(methodName, 'need options.projectId');
    return;
  }
  if (!options.location) {
    logger.error(methodName, 'need options.location');
    return;
  }
  if (!options.modelName) {
    logger.error(methodName, 'need options.modelName');
    return;
  }

  // gemini
  const gemini = {};
  gemini.client = new GoogleGenAI({
    vertexai: true,
    project: options.projectId,
    location: options.location,
  });

  // chat
  gemini.chat = async (chatOptions) => {
    return await chat(gemini.client, options.modelName, chatOptions);
  };
  gemini.chatWithStreaming = async (chatOptions, callbackOptions) => {
    return await chatWithStreaming(gemini.client, options.modelName, chatOptions, callbackOptions);
  };

  // cache
  gemini.cacheAdd = async (cacheOptions) => {
    return await cacheAdd(gemini.client, options.modelName, cacheOptions);
  };
  gemini.cacheList = async () => {
    return await cacheList(gemini.client);
  };

  // r
  return gemini;
};
