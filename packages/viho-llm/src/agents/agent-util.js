/**
 * callLLM
 * @param {*} options
 * @returns
 */
export const callLLM = async (options) => {
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
export const extractJSON = (text) => {
  const cleaned = text.replace(/\{\{/g, '{').replace(/\}\}/g, '}');
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // try next
  }
  const codeBlock = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    try {
      return JSON.parse(codeBlock[1].trim());
    } catch (e) {
      // try next
    }
  }
  const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      // try next
    }
  }
  throw new Error(`Cannot extract JSON from: ${text.slice(0, 200)}`);
};
