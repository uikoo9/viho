// path
const path = require('path');

// qiao
const cli = require('qiao-cli');
const { readFile } = require('qiao-file');

// prompt
const defaultSystemPrompt = 'You are a helpful AI assistant';

/**
 * ask
 * @param {*} llm
 * @param {*} model
 * @param {*} systemPrompt
 */
exports.ask = async (llm, model, systemPrompt) => {
  // ask
  const questions = [
    {
      type: 'editor',
      name: 'content',
      message: 'Your question:',
    },
  ];
  const answers = await cli.ask(questions);

  // answers
  console.log();
  console.log(cli.colors.gray('Question:'));
  console.log(cli.colors.gray(answers.content));
  console.log();

  // chat
  const chatOptions = {
    model: model.modelID,
    messages: [
      { role: 'system', content: systemPrompt || defaultSystemPrompt },
      { role: 'user', content: answers.content },
    ],
    thinking: {
      type: model.modelThinking,
    },
  };

  // callback options
  const callbackOptions = {
    firstThinkingCallback: () => {
      console.log();
      console.log(cli.colors.gray('[Thinking...]'));
      console.log();
    },
    thinkingCallback: (msg) => {
      process.stdout.write(cli.colors.gray(msg));
    },
    firstContentCallback: () => {
      console.log();
      console.log(cli.colors.cyan('[Response]'));
      console.log();
    },
    contentCallback: (msg) => {
      process.stdout.write(msg);
    },
    endCallback: () => {
      console.log();
      console.log();
    },
    errorCallback: (error) => {
      console.log();
      console.log(cli.colors.red('Error:'));
      console.log(error);
    },
  };

  // go
  await llm.chatWithStreaming(chatOptions, callbackOptions);
};

/**
 * expertAsk
 * @param {*} llm
 * @param {*} model
 * @param {*} expertName
 */
exports.expertAsk = async (llm, model, expertName) => {
  // llms.txt
  const txtPath = path.resolve(__dirname, `./experts/${expertName}.md`);
  const txtContent = await readFile(txtPath);

  const systemPrompt = `${defaultSystemPrompt}. You are an expert on ${expertName}. Use the following documentation to answer questions:\n\n${txtContent}`;
  await exports.ask(llm, model, systemPrompt);
};
