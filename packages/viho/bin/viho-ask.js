// qiao
const cli = require('qiao-cli');

// llm
const LLM = require('qiao-llm');

// db
const { getDB } = require('./util.js');
const db = getDB();

// cmd
cli.cmd
  .command('ask [modelName]')
  .description('Ask a question to an AI model')
  .action(async (modelName) => {
    if (!modelName) {
      const defaultModel = await db.config('default');
      if (!defaultModel) {
        console.log(cli.colors.red('No default model set. Use: viho model default'));
        return;
      }

      modelName = defaultModel;
    }

    // check
    const model = await db.config(modelName);
    if (!model) {
      console.log(cli.colors.red(`Model not found: ${modelName}`));
      return;
    }

    // init
    const llm = LLM({
      apiKey: model.apiKey,
      baseURL: model.baseURL,
    });

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
      },
      errorCallback: (error) => {
        console.log();
        console.log(cli.colors.red('Error:'));
        console.log(error);
      },
    };

    // go
    await llm.chatWithStreaming(chatOptions, callbackOptions);
  });
