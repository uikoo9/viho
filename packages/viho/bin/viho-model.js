// qiao
const cli = require('qiao-cli');

// db
const { getDB } = require('./util.js');
const db = getDB();

// actions
const actions = ['add', 'list', 'remove', 'default'];

// model
cli.cmd
  .command('model <action>')
  .description('Manage AI models')
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
    // q a
    const questions = [
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
        choices: ['enabled', 'disabled', 'auto'],
      },
    ];
    const answers = await cli.ask(questions);
    console.log();

    // check
    const dbKey = answers.modelName;
    const dbValue = await db.config(dbKey);
    if (dbValue) {
      console.log(cli.colors.red('Model name already exists'));
      return;
    }

    // set
    await db.config(dbKey, answers);
    console.log(cli.colors.green('Model added'));
    console.log();

    // list
    const all = await db.all();
    console.log(all);
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
    // list
    const all = await db.all();
    console.log(cli.colors.cyan('Configured models:'));
    console.log();
    console.log(all);
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
    const dbKey = answers.modelName;
    await db.config(dbKey, null);
    console.log(cli.colors.green('Model removed'));
    console.log();

    // list
    const all = await db.all();
    console.log(all);
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
    const all = await db.all();
    const keys = Object.keys(all);

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
      console.log(all);
      return;
    }

    // set
    await db.config('default', answers.modelName);
    console.log(cli.colors.green(`Default model: ${answers.modelName}`));
    console.log();
  } catch (e) {
    console.log(cli.colors.red('Error: Failed to set default model'));
    console.log();
    console.log(e);
  }
}
