// openai
import OpenAI from 'openai';

// util
import { chat, chatWithStreaming } from './openai-util.js';

// Logger
import { Logger } from 'qiao.log.js';
const logger = Logger('openai.js');

/**
 * OpenAI
 * @param {*} options
 * @returns
 */
export const OpenAIAPI = (options) => {
  const methodName = 'OpenAI';

  // check
  if (!options) {
    logger.error(methodName, 'need options');
    return;
  }
  if (!options.apiKey) {
    logger.error(methodName, 'need options.apiKey');
    return;
  }
  if (!options.baseURL) {
    logger.error(methodName, 'need options.baseURL');
    return;
  }
  if (!options.modelID) {
    logger.error(methodName, 'need options.modelID');
    return;
  }
  if (!options.modelThinking) {
    logger.error(methodName, 'need options.modelThinking');
    return;
  }

  // openai
  const openai = {};
  openai.client = new OpenAI({
    apiKey: options.apiKey,
    baseURL: options.baseURL,
  });

  // chat
  openai.chat = async (systemPrompt, userPrompt) => {
    return await chat(openai.client, options.modelID, options.modelThinking, systemPrompt, userPrompt);
  };

  // chat with streaming
  openai.chatWithStreaming = async (systemPrompt, userPrompt, callbakOptions) => {
    return await chatWithStreaming(
      openai.client,
      options.modelID,
      options.modelThinking,
      systemPrompt,
      userPrompt,
      callbakOptions,
    );
  };

  //
  return openai;
};
