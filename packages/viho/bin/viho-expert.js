// qiao
const cli = require('qiao-cli');

// util
const { expertAsk } = require('../src/llm.js');
const { experts } = require('../src/experts/experts.js');
const { getDB, printLogo, preLLMAsk, initLLM } = require('../src/util.js');
const db = getDB();

// actions
const actions = ['list', ...experts.map((e) => e.name)];

// model
cli.cmd
  .command('expert <action>')
  .description('Manage expert resources (list, daisyui, ...)')
  .action((action) => {
    if (!actions.includes(action)) {
      console.log(cli.colors.red(`Invalid action. Use: ${actions.join(', ')}`));
      return;
    }

    // actions
    if (action === 'list') {
      expertList();
    } else {
      // all other actions are expert names
      expertAskByName(action);
    }
  });

/**
 * expertList
 */
async function expertList() {
  // logo
  printLogo();

  console.log(cli.colors.cyan('Available experts:'));
  console.log();

  if (!experts || experts.length === 0) {
    console.log(cli.colors.gray('No experts available.'));
    console.log();
    return;
  }

  experts.forEach((expert) => {
    console.log(cli.colors.white(`  • ${expert.name}`));
    console.log(cli.colors.gray(`    URL: ${expert.url}`));
    console.log();
  });
}

/**
 * expertAskByName
 * @param {*} expertName
 */
async function expertAskByName(expertName) {
  // pre ask
  const model = await preLLMAsk(`expert (${expertName})`, db);
  if (!model) return;

  // init
  const llm = initLLM(model);

  // chat
  let keepChatting = true;
  while (keepChatting) {
    await expertAsk(llm, model, expertName);
  }
}
