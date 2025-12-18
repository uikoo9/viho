'use strict';

var genai = require('@google/genai');
var mime = require('mime-types');
var qiao_log_js = require('qiao.log.js');

// gemini
const logger = qiao_log_js.Logger('viho-llm');

/**
 * Gemini
 * @param {*} options
 * @returns
 */
const Gemini = (options) => {
  const methodName = 'Gemini';

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
  gemini.client = new genai.GoogleGenAI({
    vertexai: true,
    apiKey: options.apiKey,
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

  // r
  return gemini;
};

// chat
async function chat(client, modelName, chatOptions) {
  const methodName = 'Gemini - chat';

  // check
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
}

async function chatWithStreaming(client, modelName, chatOptions, callbackOptions) {
  const methodName = 'Gemini - chatWithStreaming';

  // check
  if (!chatOptions) {
    logger.error(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger.error(methodName, 'need chatOptions.contents');
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

// cache add
async function cacheAdd(client, modelName, cacheOptions) {
  const methodName = 'Gemini - cacheAdd';

  // check
  if (!cacheOptions) {
    logger.error(methodName, 'need cacheOptions');
    return;
  }
  if (!cacheOptions.filePath) {
    logger.error(methodName, 'need cacheOptions.filePath');
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
  const mimeType = mime.lookup(cacheOptions.filePath);
  logger.info(methodName, 'cacheOptions', cacheOptions);
  logger.info(methodName, 'mimeType', mimeType);

  try {
    // upload doc
    const doc = await client.files.upload({
      file: cacheOptions.filePath,
      config: { mimeType: mimeType },
    });
    logger.info(methodName, 'doc.name', doc.name);

    // cache add
    const cache = await client.caches.create({
      model: modelName,
      config: {
        contents: genai.createUserContent(genai.createPartFromUri(doc.uri, doc.mimeType)),
        systemInstruction: cacheOptions.systemPrompt,
        displayName: cacheOptions.cacheName,
        ttl: cacheOptions.cacheTTL,
      },
    });

    return cache;
  } catch (error) {
    logger.error(methodName, 'error', error);
  }
}

exports.Gemini = Gemini;
