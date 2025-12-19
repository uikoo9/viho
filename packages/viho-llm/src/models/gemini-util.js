// gemini
import { createUserContent, createPartFromUri } from '@google/genai';

// mime
import mime from 'mime-types';

// Logger
import { Logger } from 'qiao.log.js';
const logger = Logger('gemini-util.js');

/**
 * chat
 * @param {*} client
 * @param {*} modelName
 * @param {*} chatOptions
 * @returns
 */
export const chat = async (client, modelName, chatOptions) => {
  const methodName = 'chat';

  // check
  if (!client) {
    logger.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger.error(methodName, 'need modelName');
    return;
  }
  if (!chatOptions) {
    logger.error(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger.error(methodName, 'need chatOptions.contents');
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
};

/**
 * chatWithStreaming
 * @param {*} client
 * @param {*} modelName
 * @param {*} chatOptions
 * @param {*} callbackOptions
 * @returns
 */
export const chatWithStreaming = async (client, modelName, chatOptions, callbackOptions) => {
  const methodName = 'chatWithStreaming';

  // check
  if (!client) {
    logger.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger.error(methodName, 'need modelName');
    return;
  }
  if (!chatOptions) {
    logger.error(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger.error(methodName, 'need chatOptions.contents');
    return;
  }
  if (!callbackOptions) {
    logger.error(methodName, 'need callbackOptions');
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
};

/**
 * cacheAdd
 * @param {*} client
 * @param {*} modelName
 * @param {*} cacheOptions
 * @returns
 */
export const cacheAdd = async (client, modelName, cacheOptions) => {
  const methodName = 'cacheAdd';

  // check
  if (!cacheOptions) {
    logger.error(methodName, 'need cacheOptions');
    return;
  }
  if (!cacheOptions.gsPath) {
    logger.error(methodName, 'need cacheOptions.gsPath');
    return;
  }
  if (!cacheOptions.systemPrompt) {
    logger.error(methodName, 'need cacheOptions.systemPrompt');
    return;
  }
  if (!cacheOptions.cacheName) {
    logger.error(methodName, 'need cacheOptions.cacheName');
    return;
  }
  if (!cacheOptions.cacheTTL) {
    logger.error(methodName, 'need cacheOptions.cacheTTL');
    return;
  }

  // const
  const mimeType = mime.lookup(cacheOptions.gsPath);
  logger.info(methodName, 'cacheOptions', cacheOptions);
  logger.info(methodName, 'mimeType', mimeType);

  try {
    // cache add
    const cache = await client.caches.create({
      model: modelName,
      config: {
        contents: createUserContent(createPartFromUri(cacheOptions.gsPath, mimeType)),
        systemInstruction: cacheOptions.systemPrompt,
        displayName: cacheOptions.cacheName,
        ttl: cacheOptions.cacheTTL,
      },
    });

    return cache;
  } catch (error) {
    logger.error(methodName, 'error', error);
  }
};
