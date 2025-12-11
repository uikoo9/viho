// os
const os = require('os');

// path
const path = require('path');

// qiao
const cli = require('qiao-cli');

// db
const DB = require('qiao-config');

/**
 * getDB
 * @returns
 */
exports.getDB = () => {
  const dbPath = path.resolve(os.homedir(), './viho.json');
  return DB(dbPath);
};

/**
 * ask
 * @param {*} llm
 * @param {*} model
 */
exports.ask = async (llm, model) => {
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
      { role: 'system', content: 'You are a helpful AI assistant' },
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
