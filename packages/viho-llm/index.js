'use strict';

var genai = require('@google/genai');
var mime = require('mime-types');
var qiao_log_js = require('qiao.log.js');
var OpenAI = require('openai');
var crypto = require('crypto');
var https = require('https');

// gemini
const logger$6 = qiao_log_js.Logger('gemini-util.js');

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
    logger$6.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger$6.error(methodName, 'need modelName');
    return;
  }
  if (!chatOptions) {
    logger$6.error(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger$6.error(methodName, 'need chatOptions.contents');
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
      logger$6.error(methodName, 'invalid response');
      return;
    }

    return response.text;
  } catch (error) {
    logger$6.error(methodName, 'error', error);
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
    logger$6.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger$6.error(methodName, 'need modelName');
    return;
  }
  if (!chatOptions) {
    logger$6.error(methodName, 'need chatOptions');
    return;
  }
  if (!chatOptions.contents) {
    logger$6.error(methodName, 'need chatOptions.contents');
    return;
  }
  if (!callbackOptions) {
    logger$6.error(methodName, 'need callbackOptions');
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
    logger$6.error(methodName, 'need client');
    return;
  }
  if (!modelName) {
    logger$6.error(methodName, 'need modelName');
    return;
  }
  if (!cacheOptions) {
    logger$6.error(methodName, 'need cacheOptions');
    return;
  }
  if (!cacheOptions.gsPath) {
    logger$6.error(methodName, 'need cacheOptions.gsPath');
    return;
  }
  if (!cacheOptions.systemPrompt) {
    logger$6.error(methodName, 'need cacheOptions.systemPrompt');
    return;
  }
  if (!cacheOptions.cacheName) {
    logger$6.error(methodName, 'need cacheOptions.cacheName');
    return;
  }
  if (!cacheOptions.cacheTTL) {
    logger$6.error(methodName, 'need cacheOptions.cacheTTL');
    return;
  }

  // const
  const mimeType = mime.lookup(cacheOptions.gsPath);
  logger$6.info(methodName, 'cacheOptions', cacheOptions);
  logger$6.info(methodName, 'mimeType', mimeType);

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
    logger$6.error(methodName, 'error', error);
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
    logger$6.error(methodName, 'need client');
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
    logger$6.error(methodName, 'error', error);
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
    logger$6.error(methodName, 'need client');
    return;
  }
  if (!cacheName) {
    logger$6.error(methodName, 'need cacheName');
    return;
  }
  if (!cacheOptions) {
    logger$6.error(methodName, 'need cacheOptions');
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
    logger$6.error(methodName, 'error', error);
  }
};

// gemini
const logger$5 = qiao_log_js.Logger('gemini-api.js');

/**
 * GeminiAPI
 * @param {*} options
 * @returns
 */
const GeminiAPI = (options) => {
  const methodName = 'GeminiAPI';

  // check
  if (!options) {
    logger$5.error(methodName, 'need options');
    return;
  }
  if (!options.apiKey) {
    logger$5.error(methodName, 'need options.apiKey');
    return;
  }
  if (!options.modelName) {
    logger$5.error(methodName, 'need options.modelName');
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
const logger$4 = qiao_log_js.Logger('viho-llm');

/**
 * GeminiVertex
 * @param {*} options
 * @returns
 */
const GeminiVertex = (options) => {
  const methodName = 'GeminiVertex';

  // check
  if (!options) {
    logger$4.error(methodName, 'need options');
    return;
  }
  if (!options.projectId) {
    logger$4.error(methodName, 'need options.projectId');
    return;
  }
  if (!options.location) {
    logger$4.error(methodName, 'need options.location');
    return;
  }
  if (!options.modelName) {
    logger$4.error(methodName, 'need options.modelName');
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
const logger$3 = qiao_log_js.Logger('openai-util.js');

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
    logger$3.error(methodName, 'need client');
    return;
  }
  if (!chatOptions) {
    logger$3.error(methodName, 'need chatOptions');
    return;
  }

  // go
  try {
    const completion = await client.chat.completions.create(chatOptions);
    return completion.choices[0]?.message;
  } catch (error) {
    logger$3.error(methodName, 'error', error);
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
    logger$3.error(methodName, 'need client');
    return;
  }
  if (!chatOptions) {
    logger$3.error(methodName, 'need chatOptions');
    return;
  }
  if (!callbackOptions) {
    logger$3.error(methodName, 'need callbackOptions');
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

  // go
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
const logger$2 = qiao_log_js.Logger('openai.js');

/**
 * OpenAI
 * @param {*} options
 * @returns
 */
const OpenAIAPI = (options) => {
  const methodName = 'OpenAI';

  // check
  if (!options) {
    logger$2.error(methodName, 'need options');
    return;
  }
  if (!options.apiKey) {
    logger$2.error(methodName, 'need options.apiKey');
    return;
  }
  if (!options.baseURL) {
    logger$2.error(methodName, 'need options.baseURL');
    return;
  }

  // openai
  const openai = {};
  openai.client = new OpenAI({
    apiKey: options.apiKey,
    baseURL: options.baseURL,
  });

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

// crypto
const logger$1 = qiao_log_js.Logger('liblib-util.js');

/**
 * generateSignature
 * @param {*} uri
 * @param {*} secretKey
 * @returns
 */
const generateSignature = (uri, secretKey) => {
  const timestamp = String(Date.now());
  const signatureNonce = crypto.randomBytes(8).toString('hex');
  const content = `${uri}&${timestamp}&${signatureNonce}`;

  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(content);
  const signature = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return { signature, timestamp, signatureNonce };
};

/**
 * request
 * @param {*} baseURL
 * @param {*} accessKey
 * @param {*} secretKey
 * @param {*} uri
 * @param {*} body
 * @returns
 */
const request = (baseURL, accessKey, secretKey, uri, body) => {
  const methodName = 'request';

  return new Promise((resolve, reject) => {
    const { signature, timestamp, signatureNonce } = generateSignature(uri, secretKey);
    const query =
      `AccessKey=${accessKey}` +
      `&Signature=${signature}` +
      `&Timestamp=${timestamp}` +
      `&SignatureNonce=${signatureNonce}`;

    const postData = JSON.stringify(body);

    const options = {
      hostname: baseURL,
      path: `${uri}?${query}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          logger$1.error(methodName, 'JSON parse error', data);
          reject(new Error('JSON parse error: ' + data));
        }
      });
    });

    req.on('error', (error) => {
      logger$1.error(methodName, 'request error', error);
      reject(error);
    });
    req.write(postData);
    req.end();
  });
};

/**
 * text2img
 * @param {*} baseURL
 * @param {*} accessKey
 * @param {*} secretKey
 * @param {*} prompt
 * @param {*} options
 * @returns
 */
const text2img = (baseURL, accessKey, secretKey, prompt, options) => {
  const methodName = 'text2img';

  // check
  if (!prompt) {
    logger$1.error(methodName, 'need prompt');
    return;
  }

  options = options || {};
  const generateParams = {
    prompt: prompt,
    aspectRatio: options.aspectRatio || 'portrait',
    imgCount: options.imgCount || 1,
    steps: options.steps || 30,
  };

  if (options.width && options.height) {
    delete generateParams.aspectRatio;
    generateParams.imageSize = {
      width: options.width,
      height: options.height,
    };
  }

  if (options.controlnet) {
    generateParams.controlnet = options.controlnet;
  }

  return request(baseURL, accessKey, secretKey, '/api/generate/webui/text2img/ultra', {
    templateUuid: '5d7e67009b344550bc1aa6ccbfa1d7f4',
    generateParams: generateParams,
  });
};

/**
 * img2img
 * @param {*} baseURL
 * @param {*} accessKey
 * @param {*} secretKey
 * @param {*} prompt
 * @param {*} sourceImage
 * @param {*} options
 * @returns
 */
const img2img = (baseURL, accessKey, secretKey, prompt, sourceImage, options) => {
  const methodName = 'img2img';

  // check
  if (!prompt) {
    logger$1.error(methodName, 'need prompt');
    return;
  }
  if (!sourceImage) {
    logger$1.error(methodName, 'need sourceImage');
    return;
  }

  options = options || {};
  const generateParams = {
    prompt: prompt,
    sourceImage: sourceImage,
    imgCount: options.imgCount || 1,
  };

  if (options.controlnet) {
    generateParams.controlnet = options.controlnet;
  }

  return request(baseURL, accessKey, secretKey, '/api/generate/webui/img2img/ultra', {
    templateUuid: '07e00af4fc464c7ab55ff906f8acf1b7',
    generateParams: generateParams,
  });
};

/**
 * queryStatus
 * @param {*} baseURL
 * @param {*} accessKey
 * @param {*} secretKey
 * @param {*} generateUuid
 * @returns
 */
const queryStatus = (baseURL, accessKey, secretKey, generateUuid) => {
  return request(baseURL, accessKey, secretKey, '/api/generate/webui/status', {
    generateUuid: generateUuid,
  });
};

/**
 * waitForResult
 * @param {*} baseURL
 * @param {*} accessKey
 * @param {*} secretKey
 * @param {*} generateUuid
 * @param {*} intervalMs
 * @param {*} maxRetries
 * @returns
 */
const waitForResult = (baseURL, accessKey, secretKey, generateUuid, intervalMs, maxRetries) => {
  intervalMs = intervalMs || 3000;
  maxRetries = maxRetries || 60;

  return new Promise((resolve, reject) => {
    let attempt = 0;

    function poll() {
      attempt++;
      queryStatus(baseURL, accessKey, secretKey, generateUuid)
        .then((res) => {
          const status = res.data && res.data.generateStatus;

          if (status === 5) {
            return resolve(res.data);
          }
          if (status === 6 || status === 7) {
            return reject(new Error('Generation failed: ' + (res.data.generateMsg || 'unknown')));
          }

          if (attempt >= maxRetries) {
            return reject(new Error('Polling timeout after ' + maxRetries + ' retries'));
          }

          setTimeout(poll, intervalMs);
        })
        .catch(reject);
    }

    poll();
  });
};

// util
const logger = qiao_log_js.Logger('liblib.js');

/**
 * LibLibAPI
 * @param {*} options
 * @returns
 */
const LibLibAPI = (options) => {
  const methodName = 'LibLibAPI';

  // check
  if (!options) {
    logger.error(methodName, 'need options');
    return;
  }
  if (!options.accessKey) {
    logger.error(methodName, 'need options.accessKey');
    return;
  }
  if (!options.secretKey) {
    logger.error(methodName, 'need options.secretKey');
    return;
  }

  // config
  const baseURL = options.baseURL || 'openapi.liblibai.cloud';
  const accessKey = options.accessKey;
  const secretKey = options.secretKey;

  // liblib
  const liblib = {};

  // text2img
  liblib.text2img = async (prompt, imgOptions) => {
    return await text2img(baseURL, accessKey, secretKey, prompt, imgOptions);
  };

  // img2img
  liblib.img2img = async (prompt, sourceImage, imgOptions) => {
    return await img2img(baseURL, accessKey, secretKey, prompt, sourceImage, imgOptions);
  };

  // queryStatus
  liblib.queryStatus = async (generateUuid) => {
    return await queryStatus(baseURL, accessKey, secretKey, generateUuid);
  };

  // waitForResult
  liblib.waitForResult = async (generateUuid, intervalMs, maxRetries) => {
    return await waitForResult(baseURL, accessKey, secretKey, generateUuid, intervalMs, maxRetries);
  };

  //
  return liblib;
};

/**
 * callLLM
 * @param {*} options
 * @returns
 */
const callLLM = async (options) => {
  const chatOptions = {
    model: options.modelName,
    messages: options.messages,
  };
  if (options.thinking) chatOptions.thinking = options.thinking;
  const response = await options.llm.chat(chatOptions);
  const fullContent = response.content || '';

  // r
  return options.isJson ? extractJSON(fullContent) : fullContent;
};

/**
 * extractJSON
 * @param {*} text
 * @returns
 */
const extractJSON = (text) => {
  if (typeof text === 'object' && text !== null) return text;
  const str = String(text).trim();

  // 1. 尝试直接解析
  try {
    return JSON.parse(str);
  } catch (_) {
    /* ignore */
  }

  // 2. 尝试从 markdown 代码块提取
  const codeBlockMatch = str.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch (_) {
      /* ignore */
    }
  }

  // 3. 尝试提取第一个 {...} 块
  const firstBrace = str.indexOf('{');
  const lastBrace = str.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(str.slice(firstBrace, lastBrace + 1));
    } catch (_) {
      /* ignore */
    }
  }

  throw new Error(`Cannot parse JSON from LLM response: ${str.slice(0, 200)}`);
};

// util

/**
 * runAgents
 * @param {*} agents
 */
const runAgents = async (agents) => {
  // const
  const agentResponses = [];

  // for
  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];

    // const
    const agentStartCallback = agent.agentStartCallback;
    const agentRequestOptions = agent.agentRequestOptions;
    const agentEndCallback = agent.agentEndCallback;
    const agentBreakCallback = agent.agentBreakCallback;

    // go
    agentStartCallback();
    const agentResponse = await callLLM(agentRequestOptions);
    agentResponses.push(agentResponse);

    // check
    const breakAgent = agentEndCallback(agentResponse, agentResponses);
    if (breakAgent) {
      if (agentBreakCallback) agentBreakCallback();
      break;
    }
  }
};

exports.GeminiAPI = GeminiAPI;
exports.GeminiVertex = GeminiVertex;
exports.LibLibAPI = LibLibAPI;
exports.OpenAIAPI = OpenAIAPI;
exports.runAgents = runAgents;
