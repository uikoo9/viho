// qiao
const cli = require('qiao-cli');

// llm
const LLM = require('qiao-llm');

// util
const { getDB, ask, printLogo } = require('./util.js');
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

    // logo
    printLogo();

    await ask(llm, model);
  });
