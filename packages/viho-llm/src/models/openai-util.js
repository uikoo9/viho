// Logger
import { Logger } from 'qiao.log.js';
const logger = Logger('openai-util.js');

/**
 * chat
 * @param {*} client
 * @param {*} options
 * @returns
 */
export const chat = async (client, options) => {
  const methodName = 'chat';

  // check
  if (!client) {
    logger.error(methodName, 'need client');
    return;
  }
  if (!options) {
    logger.error(methodName, 'need options');
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
  if (!options.systemPrompt) {
    logger.error(methodName, 'need options.systemPrompt');
    return;
  }
  if (!options.userPrompt) {
    logger.error(methodName, 'need options.userPrompt');
    return;
  }

  // chat
  const chatOptions = {
    model: options.modelID,
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: options.userPrompt },
    ],
    thinking: {
      type: options.modelThinking,
    },
  };

  // go
  try {
    const completion = await client.chat.completions.create(chatOptions);
    return completion.choices[0]?.message;
  } catch (error) {
    logger.error(methodName, 'error', error);
  }
};

/**
 * chatWithStreaming
 * @param {*} client
 * @param {*} options
 * @param {*} callbackOptions
 * @returns
 */
export const chatWithStreaming = async (client, options, callbackOptions) => {
  const methodName = 'chatWithStreaming';

  // check
  if (!client) {
    logger.error(methodName, 'need client');
    return;
  }
  if (!options) {
    logger.error(methodName, 'need options');
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
  if (!options.systemPrompt) {
    logger.error(methodName, 'need options.systemPrompt');
    return;
  }
  if (!options.userPrompt) {
    logger.error(methodName, 'need options.userPrompt');
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
  const thinkingCallback = callbackOptions.thinkingCallback;
  const firstThinkingCallback = callbackOptions.firstThinkingCallback;
  const contentCallback = callbackOptions.contentCallback;
  const firstContentCallback = callbackOptions.firstContentCallback;

  // chat
  const chatOptions = {
    model: options.modelID,
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: options.userPrompt },
    ],
    thinking: {
      type: options.modelThinking,
    },
  };

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
