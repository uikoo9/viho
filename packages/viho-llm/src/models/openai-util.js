// Logger
import { Logger } from 'qiao.log.js';
const logger = Logger('openai-util.js');

/**
 * chat
 * @param {*} client
 * @param {*} chatOptions
 * @returns
 */
export const chat = async (client, chatOptions) => {
  const methodName = 'chat';

  // check
  if (!client) {
    logger.error(methodName, 'need client');
    return;
  }
  if (!chatOptions) {
    logger.error(methodName, 'need chatOptions');
    return;
  }

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
 * @param {*} chatOptions
 * @param {*} callbackOptions
 * @returns
 */
export const chatWithStreaming = async (client, chatOptions, callbackOptions) => {
  const methodName = 'chatWithStreaming';

  // check
  if (!client) {
    logger.error(methodName, 'need client');
    return;
  }
  if (!chatOptions) {
    logger.error(methodName, 'need chatOptions');
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
