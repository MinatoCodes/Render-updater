cat > cli.js <<'EOL'
#!/usr/bin/env node
const { program } = require('commander');
const { updateFiles } = require('./commands');

program
  .version('1.0.0')
  .command('update')
  .description('Update whitelisted files')
  .option('--dry-run', 'Test without changes')
  .action((options) => {
    if (options.dryRun) process.env.DRY_RUN = 'true';
    updateFiles();
  });

program.parse();
EOL
