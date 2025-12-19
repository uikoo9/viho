'use strict';

var genai = require('@google/genai');
var mime = require('mime-types');
var qiao_log_js = require('qiao.log.js');

// gemini
const logger$2 = qiao_log_js.Logger('gemini-util.js');

/**
 * chat
 * @param {*} client
 * @param {*} modelName
 * @param {*} chatOptions
 * @returns
 */
const chat = async (client, modelName, chatOptions) => {
  const methodName = 'chat';

  // check
  if (!client) {
    logger$2.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger$2.error(methodName, 'need modelName');
    return;
  }
  if (!chatOptions) {
    logger$2.error(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger$2.error(methodName, 'need chatOptions.contents');
    return;
  }

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: chatOptions.contents,
    });
    if (!response || !response.text) {
      logger$2.error(methodName, 'invalid response');
      return;
    }

    return response.text;
  } catch (error) {
    logger$2.error(methodName, 'error', error);
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
const chatWithStreaming = async (client, modelName, chatOptions, callbackOptions) => {
  const methodName = 'chatWithStreaming';

  // check
  if (!client) {
    logger$2.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger$2.error(methodName, 'need modelName');
    return;
  }
  if (!chatOptions) {
    logger$2.error(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger$2.error(methodName, 'need chatOptions.contents');
    return;
  }
  if (!callbackOptions) {
    logger$2.error(methodName, 'need callbackOptions');
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
const cacheAdd = async (client, modelName, cacheOptions) => {
  const methodName = 'cacheAdd';

  // check
  if (!client) {
    logger$2.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger$2.error(methodName, 'need modelName');
    return;
  }
  if (!cacheOptions) {
    logger$2.error(methodName, 'need cacheOptions');
    return;
  }
  if (!cacheOptions.gsPath) {
    logger$2.error(methodName, 'need cacheOptions.gsPath');
    return;
  }
  if (!cacheOptions.systemPrompt) {
    logger$2.error(methodName, 'need cacheOptions.systemPrompt');
    return;
  }
  if (!cacheOptions.cacheName) {
    logger$2.error(methodName, 'need cacheOptions.cacheName');
    return;
  }
  if (!cacheOptions.cacheTTL) {
    logger$2.error(methodName, 'need cacheOptions.cacheTTL');
    return;
  }

  // const
  const mimeType = mime.lookup(cacheOptions.gsPath);
  logger$2.info(methodName, 'cacheOptions', cacheOptions);
  logger$2.info(methodName, 'mimeType', mimeType);

  try {
    // cache add
    const cache = await client.caches.create({
      model: modelName,
      config: {
        contents: genai.createUserContent(genai.createPartFromUri(cacheOptions.gsPath, mimeType)),
        systemInstruction: cacheOptions.systemPrompt,
        displayName: cacheOptions.cacheName,
        ttl: cacheOptions.cacheTTL,
      },
    });

    return cache;
  } catch (error) {
    logger$2.error(methodName, 'error', error);
  }
};

/**
 * cacheList
 * @param {*} client
 * @returns
 */
const cacheList = async (client) => {
  const methodName = 'cacheList';

  // check
  if (!client) {
    logger$2.error(methodName, 'need client');
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
    logger$2.error(methodName, 'error', error);
  }
};

// gemini
const logger$1 = qiao_log_js.Logger('gemini-api.js');

/**
 * GeminiAPI
 * @param {*} options
 * @returns
 */
const GeminiAPI = (options) => {
  const methodName = 'GeminiAPI';

  // check
  if (!options) {
    logger$1.error(methodName, 'need options');
    return;
  }
  if (!options.apiKey) {
    logger$1.error(methodName, 'need options.apiKey');
    return;
  }
  if (!options.modelName) {
    logger$1.error(methodName, 'need options.modelName');
    return;
  }

  // gemini
  const gemini = {};
  gemini.client = new genai.GoogleGenAI({
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

// gemini
const logger = qiao_log_js.Logger('viho-llm');

/**
 * GeminiVertex
 * @param {*} options
 * @returns
 */
const GeminiVertex = (options) => {
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
  gemini.client = new genai.GoogleGenAI({
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

exports.GeminiAPI = GeminiAPI;
exports.GeminiVertex = GeminiVertex;
