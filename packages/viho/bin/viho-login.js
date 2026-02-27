// qiao
const cli = require('qiao-cli');

// util
const { getDB, printLogo } = require('../src/util.js');
const db = getDB();

// cmd
cli.cmd
  .command('login')
  .description('Login to https://n1n.ai/ to get token')
  .action(async () => {
    // logo
    printLogo();

    // const
    const key = 'n1nToken';
    const n1nToken = await db.config(key);

    // check
    if (n1nToken) {
      console.log(cli.colors.yellow('Already logged in with token: ***'));
      console.log();
      return;
    }

    // tips
    console.log(cli.colors.cyan('Please visit https://n1n.ai/ to get your token'));
    console.log();

    // answers
    const answers = await cli.ask([
      {
        type: 'input',
        name: 'n1nToken',
        message: 'Enter your n1n.ai token:',
      },
    ]);

    // save token
    await db.config(key, answers.n1nToken);
    console.log();
    console.log(cli.colors.green('Login successful!'));
    console.log();
  });
