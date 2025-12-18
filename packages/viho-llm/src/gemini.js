// gemini
import { GoogleGenAI } from '@google/genai';

// Logger
import { Logger } from 'qiao.log.js';
const logger = Logger('viho-llm');

/**
 * Gemini
 * @param {*} options
 * @returns
 */
export const Gemini = (options) => {
  const methodName = 'Gemini';

  // check
  if (!options) {
    logger.info(methodName, 'need options');
    return;
  }
  if (!options.apiKey) {
    logger.info(methodName, 'need options.apiKey');
    return;
  }
  if (!options.modelName) {
    logger.info(methodName, 'need options.modelName');
    return;
  }

  // gemini
  const gemini = {};
  gemini.client = new GoogleGenAI({
    vertexai: true,
    apiKey: options.apiKey,
  });

  // chat
  gemini.chat = async (chatOptions) => {
    return await chat(gemini.client, options.modelName, chatOptions);
  };

  // r
  return gemini;
};

// chat
async function chat(client, modelName, chatOptions) {
  const methodName = 'Gemini - chat';

  // check
  if (!chatOptions) {
    logger.info(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger.info(methodName, 'need chatOptions.contents');
    return;
  }

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: chatOptions.contents,
    });
    if (!response || !response.text) {
      logger.error(methodName, 'invalid response');
      return;
    }

    return response.text;
  } catch (error) {
    logger.error(methodName, 'error', error);
  }
}
