// qiao
const cli = require('qiao-cli');

// util
const { getModels, setModels } = require('../src/model.js');
const { getDB, printLogo } = require('../src/util.js');
const db = getDB();

// actions
const actions = ['add', 'list', 'remove', 'default'];

// model
cli.cmd
  .command('model <action>')
  .description('Manage AI model configurations (add, list, remove, default)')
  .action((action) => {
    if (!actions.includes(action)) {
      console.log(cli.colors.red('Invalid action. Use: add, list, remove, default'));
      return;
    }

    // actions
    if (action === 'add') modelAdd();
    if (action === 'list') modelList();
    if (action === 'remove') modelRemove();
    if (action === 'default') modelDefault();
  });

/**
 * modelAdd
 * @returns
 */
async function modelAdd() {
  try {
    // model type
    const modelTypeQuestion = [
      {
        type: 'list',
        name: 'modelType',
        message: 'openai vs gemini',
        choices: ['openai', 'gemini api', 'gemini vertex'],
      },
    ];
    const modelTypeAnswer = await cli.ask(modelTypeQuestion);

    // questions
    const openAIQuestion = [
      {
        type: 'input',
        name: 'modelName',
        message: 'Enter model name:',
      },
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter API key:',
      },
      {
        type: 'input',
        name: 'baseURL',
        message: 'Enter base URL:',
      },
      {
        type: 'input',
        name: 'modelID',
        message: 'Enter model ID:',
      },
      {
        type: 'list',
        name: 'modelThinking',
        message: 'Thinking mode:',
        choices: ['enabled', 'disabled'],
      },
    ];
    const geminiAPIQuestion = [
      {
        type: 'input',
        name: 'modelName',
        message: 'Enter model name:',
      },
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter API key:',
      },
    ];
    const geminiVertexQuestion = [
      {
        type: 'input',
        name: 'modelName',
        message: 'Enter model name:',
      },
      {
        type: 'input',
        name: 'projectId',
        message: 'Enter projectId:',
      },
      {
        type: 'input',
        name: 'location',
        message: 'Enter location:',
      },
    ];

    // final question
    let finalQuestion;
    if (modelTypeAnswer.modelType === 'openai') finalQuestion = openAIQuestion;
    if (modelTypeAnswer.modelType === 'gemini api') finalQuestion = geminiAPIQuestion;
    if (modelTypeAnswer.modelType === 'gemini vertex') finalQuestion = geminiVertexQuestion;

    // answers
    const answers = await cli.ask(finalQuestion);
    answers.modelType = modelTypeAnswer.modelType;
    console.log();

    // check
    const modelName = answers.modelName;
    const models = await getModels(db);
    const isModelExists = models.some((model) => model.modelName === modelName);
    if (isModelExists) {
      console.log(cli.colors.red('Model name already exists'));
      return;
    }

    // set
    models.push(answers);
    await setModels(db, models);
    console.log(cli.colors.green('Model added successfully!'));
    console.log();
  } catch (e) {
    console.log(cli.colors.red('Error: Failed to add model'));
    console.log();
    console.log(e);
  }
}

/**
 * modelList
 */
async function modelList() {
  try {
    // logo
    printLogo();

    // list
    const models = await getModels(db);
    const defaultModel = await db.config('default');

    console.log(cli.colors.cyan('Configured models:'));
    console.log();

    if (!models || models.length === 0) {
      console.log(cli.colors.gray('No models configured. Use: viho model add'));
      console.log();
      return;
    }

    models.forEach((model) => {
      const isDefault = model.modelName === defaultModel;
      const defaultTag = isDefault ? cli.colors.green(' (default)') : '';
      console.log(cli.colors.white(`  • ${model.modelName}${defaultTag}`));
      console.log(cli.colors.gray(`    Type: ${model.modelType || 'openai'}`));

      if (model.modelType === 'openai') {
        console.log(cli.colors.gray(`    Model ID: ${model.modelID}`));
        console.log(cli.colors.gray(`    Base URL: ${model.baseURL}`));
        console.log(cli.colors.gray(`    Thinking: ${model.modelThinking}`));
      } else if (model.modelType === 'gemini api') {
        console.log(cli.colors.gray(`    API Key: ${model.apiKey ? '***' : 'Not set'}`));
      } else if (model.modelType === 'gemini vertex') {
        console.log(cli.colors.gray(`    Project ID: ${model.projectId}`));
        console.log(cli.colors.gray(`    Location: ${model.location}`));
      }

      console.log();
    });

    if (!defaultModel) {
      console.log(cli.colors.yellow('No default model set. Use: viho model default'));
      console.log();
    }
  } catch (e) {
    console.log(cli.colors.red('Error: Failed to list models'));
    console.log();

    console.log(e);
  }
}

/**
 * modelRemove
 */
async function modelRemove() {
  try {
    // q a
    const questions = [
      {
        type: 'input',
        name: 'modelName',
        message: 'Enter model name to remove:',
      },
    ];
    const answers = await cli.ask(questions);
    console.log();

    // del
    const models = await getModels(db);
    const modelNameToRemove = answers.modelName;

    // check if model exists
    const modelExists = models.some((model) => model.modelName === modelNameToRemove);
    if (!modelExists) {
      console.log(cli.colors.red(`Model not found: ${modelNameToRemove}`));
      console.log();
      return;
    }

    const newModels = models.filter((model) => model.modelName !== modelNameToRemove);
    await setModels(db, newModels);

    // clear default if removed model was default
    const defaultModel = await db.config('default');
    if (defaultModel === modelNameToRemove) {
      await db.config('default', null);
      console.log(cli.colors.yellow('Removed model was set as default. Please set a new default.'));
      console.log();
    }

    console.log(cli.colors.green('Model removed successfully!'));
    console.log();
  } catch (e) {
    console.log(cli.colors.red('Error: Failed to remove model'));
    console.log();

    console.log(e);
  }
}

/**
 * modelDefault
 * @returns
 */
async function modelDefault() {
  try {
    // q a
    const questions = [
      {
        type: 'input',
        name: 'modelName',
        message: 'Enter default model name:',
      },
    ];
    const answers = await cli.ask(questions);
    console.log();

    // get keys
    const models = await getModels(db);
    const keys = models.map((model) => model.modelName);

    // check keys
    if (!keys || !keys.length) {
      console.log(cli.colors.red('No models found. Add one first: viho model add'));
      console.log();
      return;
    }

    // check model
    if (!keys.includes(answers.modelName)) {
      console.log(cli.colors.red('Model not found. Available models:'));
      console.log();
      models.forEach((model) => {
        console.log(cli.colors.gray(`  • ${model.modelName}`));
      });
      console.log();
      return;
    }

    // set
    await db.config('default', answers.modelName);
    console.log(cli.colors.green(`Default model set to: ${answers.modelName}`));
    console.log();
  } catch (e) {
    console.log(cli.colors.red('Error: Failed to set default model'));
    console.log();
    console.log(e);
  }
}
