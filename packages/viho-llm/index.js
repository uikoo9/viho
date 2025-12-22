'use strict';

var genai = require('@google/genai');
var mime = require('mime-types');
var qiao_log_js = require('qiao.log.js');
var OpenAI = require('openai');

// gemini
const logger$4 = qiao_log_js.Logger('gemini-util.js');

/**
 * chat
 * @param {*} client
 * @param {*} modelName
 * @param {*} chatOptions
 * @returns
 */
const chat$1 = async (client, modelName, chatOptions) => {
  const methodName = 'chat';

  // check
  if (!client) {
    logger$4.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger$4.error(methodName, 'need modelName');
    return;
  }
  if (!chatOptions) {
    logger$4.error(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger$4.error(methodName, 'need chatOptions.contents');
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
    if (!response || !response.text) {
      logger$4.error(methodName, 'invalid response');
      return;
    }

    return response.text;
  } catch (error) {
    logger$4.error(methodName, 'error', error);
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
const chatWithStreaming$1 = async (client, modelName, chatOptions, callbackOptions) => {
  const methodName = 'chatWithStreaming';

  // check
  if (!client) {
    logger$4.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger$4.error(methodName, 'need modelName');
    return;
  }
  if (!chatOptions) {
    logger$4.error(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger$4.error(methodName, 'need chatOptions.contents');
    return;
  }
  if (!callbackOptions) {
    logger$4.error(methodName, 'need callbackOptions');
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
const cacheAdd = async (client, modelName, cacheOptions) => {
  const methodName = 'cacheAdd';

  // check
  if (!client) {
    logger$4.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger$4.error(methodName, 'need modelName');
    return;
  }
  if (!cacheOptions) {
    logger$4.error(methodName, 'need cacheOptions');
    return;
  }
  if (!cacheOptions.gsPath) {
    logger$4.error(methodName, 'need cacheOptions.gsPath');
    return;
  }
  if (!cacheOptions.systemPrompt) {
    logger$4.error(methodName, 'need cacheOptions.systemPrompt');
    return;
  }
  if (!cacheOptions.cacheName) {
    logger$4.error(methodName, 'need cacheOptions.cacheName');
    return;
  }
  if (!cacheOptions.cacheTTL) {
    logger$4.error(methodName, 'need cacheOptions.cacheTTL');
    return;
  }

  // const
  const mimeType = mime.lookup(cacheOptions.gsPath);
  logger$4.info(methodName, 'cacheOptions', cacheOptions);
  logger$4.info(methodName, 'mimeType', mimeType);

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
    logger$4.error(methodName, 'error', error);
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
    logger$4.error(methodName, 'need client');
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
    logger$4.error(methodName, 'error', error);
  }
};

/**
 * cacheUpdate
 * @param {*} client
 * @param {*} cacheName
 * @param {*} cacheOptions
 * @returns
 */
const cacheUpdate = async (client, cacheName, cacheOptions) => {
  const methodName = 'cacheUpdate';

  // check
  if (!client) {
    logger$4.error(methodName, 'need client');
    return;
  }
  if (!cacheName) {
    logger$4.error(methodName, 'need cacheName');
    return;
  }
  if (!cacheOptions) {
    logger$4.error(methodName, 'need cacheOptions');
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
    logger$4.error(methodName, 'error', error);
  }
};

// gemini
const logger$3 = qiao_log_js.Logger('gemini-api.js');

/**
 * GeminiAPI
 * @param {*} options
 * @returns
 */
const GeminiAPI = (options) => {
  const methodName = 'GeminiAPI';

  // check
  if (!options) {
    logger$3.error(methodName, 'need options');
    return;
  }
  if (!options.apiKey) {
    logger$3.error(methodName, 'need options.apiKey');
    return;
  }
  if (!options.modelName) {
    logger$3.error(methodName, 'need options.modelName');
    return;
  }

  // gemini
  const gemini = {};
  gemini.client = new genai.GoogleGenAI({
    apiKey: options.apiKey,
  });

  // chat
  gemini.chat = async (chatOptions) => {
    return await chat$1(gemini.client, options.modelName, chatOptions);
  };
  gemini.chatWithStreaming = async (chatOptions, callbackOptions) => {
    return await chatWithStreaming$1(gemini.client, options.modelName, chatOptions, callbackOptions);
  };

  // r
  return gemini;
};

// gemini
const logger$2 = qiao_log_js.Logger('viho-llm');

/**
 * GeminiVertex
 * @param {*} options
 * @returns
 */
const GeminiVertex = (options) => {
  const methodName = 'GeminiVertex';

  // check
  if (!options) {
    logger$2.error(methodName, 'need options');
    return;
  }
  if (!options.projectId) {
    logger$2.error(methodName, 'need options.projectId');
    return;
  }
  if (!options.location) {
    logger$2.error(methodName, 'need options.location');
    return;
  }
  if (!options.modelName) {
    logger$2.error(methodName, 'need options.modelName');
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
    return await chat$1(gemini.client, options.modelName, chatOptions);
  };
  gemini.chatWithStreaming = async (chatOptions, callbackOptions) => {
    return await chatWithStreaming$1(gemini.client, options.modelName, chatOptions, callbackOptions);
  };

  // cache
  gemini.cacheAdd = async (cacheOptions) => {
    return await cacheAdd(gemini.client, options.modelName, cacheOptions);
  };
  gemini.cacheList = async () => {
    return await cacheList(gemini.client);
  };
  gemini.cacheUpdate = async (cacheName, cacheOptions) => {
    return await cacheUpdate(gemini.client, cacheName, cacheOptions);
  };

  // r
  return gemini;
};

// Logger
const logger$1 = qiao_log_js.Logger('openai-util.js');

/**
 * chat
 * @param {*} client
 * @param {*} chatOptions
 * @returns
 */
const chat = async (client, chatOptions) => {
  const methodName = 'chat';

  // check
  if (!client) {
    logger$1.error(methodName, 'need client');
    return;
  }
  if (!chatOptions) {
    logger$1.error(methodName, 'need chatOptions');
    return;
  }

  // go
  try {
    const completion = await client.chat.completions.create(chatOptions);
    return completion.choices[0]?.message;
  } catch (error) {
    logger$1.error(methodName, 'error', error);
  }
};

/**
 * chatWithStreaming
 * @param {*} client
 * @param {*} chatOptions
 * @param {*} callbackOptions
 * @returns
 */
const chatWithStreaming = async (client, chatOptions, callbackOptions) => {
  const methodName = 'chatWithStreaming';

  // check
  if (!client) {
    logger$1.error(methodName, 'need client');
    return;
  }
  if (!chatOptions) {
    logger$1.error(methodName, 'need chatOptions');
    return;
  }
  if (!callbackOptions) {
    logger$1.error(methodName, 'need callbackOptions');
    return;
  }

  // callback
  const beginCallback = callbackOptions.beginCallback;
  const endCallback = callbackOptions.endCallback;
  const errorCallback = callbackOptions.errorCallback;
  const thinkingCallback = callbackOptions.thinkingCallback;
  const firstThinkingCallback = callbackOptions.firstThinkingCallback;
  const contentCallback = callbackOptions.contentCallback;
  const firstContentCallback = callbackOptions.firstContentCallback;

  try {
    chatOptions.stream = true;
    const stream = await client.chat.completions.create(chatOptions);
    if (beginCallback) beginCallback();

    // go
    let firstThinking = true;
    let firstContent = true;
    for await (const part of stream) {
      // thinking
      const thinkingContent = part.choices[0]?.delta?.reasoning_content;
      if (thinkingContent && thinkingCallback) {
        if (firstThinking && firstThinkingCallback) {
          firstThinking = false;
          firstThinkingCallback();
        }

        thinkingCallback(thinkingContent);
      }

      // content
      const content = part.choices[0]?.delta?.content;
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

// openai
const logger = qiao_log_js.Logger('openai.js');

/**
 * OpenAI
 * @param {*} options
 * @returns
 */
const OpenAIAPI = (options) => {
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

  // openai
  const openai = {};
  openai.client = new OpenAI(options);

  // chat
  openai.chat = async (chatOptions) => {
    return await chat(openai.client, chatOptions);
  };

  // chat with streaming
  openai.chatWithStreaming = async (chatOptions, callbakOptions) => {
    return await chatWithStreaming(openai.client, chatOptions, callbakOptions);
  };

  //
  return openai;
};

exports.GeminiAPI = GeminiAPI;
exports.GeminiVertex = GeminiVertex;
exports.OpenAIAPI = OpenAIAPI;
