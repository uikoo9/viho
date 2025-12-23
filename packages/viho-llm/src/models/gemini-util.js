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
    // options
    const options = Object.assign(
      {
        model: modelName,
      },
      chatOptions,
    );

    // gen
    const response = await client.models.generateContent(options);
    if (!response || !response.candidates?.[0]?.content) {
      logger.error(methodName, 'invalid response');
      return;
    }

    // json
    const rawText = response.candidates[0].content.parts[0].text;
    if (options.generationConfig?.responseMimeType === 'application/json') {
      try {
        return JSON.parse(rawText);
      } catch (e) {
        logger.warn(methodName, 'Failed to parse JSON response', rawText);
        return rawText;
      }
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
    // options
    const options = Object.assign(
      {
        model: modelName,
      },
      chatOptions,
    );

    // gen
    const response = await client.models.generateContentStream(options);
    if (beginCallback) beginCallback();

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
  if (!client) {
    logger.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger.error(methodName, 'need modelName');
    return;
  }
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

/**
 * cacheList
 * @param {*} client
 * @returns
 */
export const cacheList = async (client) => {
  const methodName = 'cacheList';

  // check
  if (!client) {
    logger.error(methodName, 'need client');
    return;
  }

  // cache list
  try {
    const cacheList = await client.caches.list();
    const cacheObjs = cacheList?.pageInternal?.map((contentCache) => ({
      name: contentCache.name,
      displayName: contentCache.displayName,
    }));

    return cacheObjs;
  } catch (error) {
    logger.error(methodName, 'error', error);
  }
};

/**
 * cacheUpdate
 * @param {*} client
 * @param {*} cacheName
 * @param {*} cacheOptions
 * @returns
 */
export const cacheUpdate = async (client, cacheName, cacheOptions) => {
  const methodName = 'cacheUpdate';

  // check
  if (!client) {
    logger.error(methodName, 'need client');
    return;
  }
  if (!cacheName) {
    logger.error(methodName, 'need cacheName');
    return;
  }
  if (!cacheOptions) {
    logger.error(methodName, 'need cacheOptions');
    return;
  }

  // cache update
  try {
    const res = await client.caches.update({
      name: cacheName,
      config: cacheOptions,
    });

    return res;
  } catch (error) {
    logger.error(methodName, 'error', error);
  }
};
