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

  // chat with streaming
  gemini.chatWithStreaming = async (chatOptions, callbackOptions) => {
    return await chatWithStreaming(gemini.client, options.modelName, chatOptions, callbackOptions);
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

async function chatWithStreaming(client, modelName, chatOptions, callbackOptions) {
  const methodName = 'Gemini - chatWithStreaming';

  // check
  if (!chatOptions) {
    logger.info(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger.info(methodName, 'need chatOptions.contents');
    return;
  }

  // callback
  const beginCallback = callbackOptions.beginCallback;
  const endCallback = callbackOptions.endCallback;
  const errorCallback = callbackOptions.errorCallback;
  const contentCallback = callbackOptions.contentCallback;
  const firstContentCallback = callbackOptions.firstContentCallback;

  try {
    if (beginCallback) beginCallback();
    const response = await client.models.generateContentStream({
      model: modelName,
      contents: chatOptions.contents,
    });

    // go
    let firstContent = true;
    for await (const chunk of response) {
      // content
      const content = chunk.text;
      if (content && contentCallback) {
        if (firstContent && firstContentCallback) {
          firstContent = false;
          firstContentCallback();
        }

        contentCallback(content);
      }
    }

    // end
    if (endCallback) endCallback();
  } catch (error) {
    if (errorCallback) errorCallback(error);
  }
}
