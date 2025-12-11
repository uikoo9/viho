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
  .description('模型相关操作')
  .action((action) => {
    if (!actions.includes(action)) {
      console.log(cli.colors.red('非法的模型操作'));
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
        message: '请输入模型名称：',
      },
      {
        type: 'input',
        name: 'apiKey',
        message: '请输入apiKey：',
      },
      {
        type: 'input',
        name: 'baseURL',
        message: '请输入baseURL：',
      },
      {
        type: 'input',
        name: 'modelID',
        message: '请输入模型ID：',
      },
      {
        type: 'list',
        name: 'modelThinking',
        message: '是否启动思考模式：',
        choices: ['enabled', 'disabled', 'auto'],
      },
    ];
    const answers = await cli.ask(questions);
    console.log();

    // check
    const dbKey = answers.modelName;
    const dbValue = await db.config(dbKey);
    if (dbValue) {
      console.log(cli.colors.red('模型名称已经存在，请换一个模型名称。'));
      return;
    }

    // set
    await db.config(dbKey, answers);
    console.log(cli.colors.blue('模型已添加，目前记录的模型信息有：'));
    console.log();

    // list
    const all = await db.all();
    console.log(all);
  } catch (e) {
    console.log(cli.colors.red('设置模型出错。'));
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
    console.log(cli.colors.blue('目前已经添加的模型有：'));
    console.log();
    console.log(all);
  } catch (e) {
    console.log(cli.colors.red('列出模型出错。'));
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
        message: '请输入要删除的模型名称：',
      },
    ];
    const answers = await cli.ask(questions);
    console.log();

    // del
    const dbKey = answers.modelName;
    await db.config(dbKey, null);
    console.log(cli.colors.blue('模型已删除。'));
    console.log();

    // list
    const all = await db.all();
    console.log(all);
  } catch (e) {
    console.log(cli.colors.red('删除模型出错。'));
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
        message: '请输入要设置为默认的模型：',
      },
    ];
    const answers = await cli.ask(questions);
    console.log();

    // get keys
    const all = await db.all();
    const keys = Object.keys(all);

    // check keys
    if (!keys || !keys.length) {
      console.log(cli.colors.red('请先添加模型：qllm add'));
      console.log();
      return;
    }

    // check model
    if (!keys.includes(answers.modelName)) {
      console.log(cli.colors.red('没有找到这个模型，已添加模型如下：'));
      console.log();
      console.log(all);
      return;
    }

    // set
    await db.config('default', answers.modelName);
    console.log(cli.colors.blue(`默认模型设置成功：${answers.modelName}`));
    console.log();
  } catch (e) {
    console.log(cli.colors.red('设置默认模型出错。'));
    console.log();
    console.log(e);
  }
}
