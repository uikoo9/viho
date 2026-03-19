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
