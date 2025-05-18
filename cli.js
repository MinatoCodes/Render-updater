#!/usr/bin/env node
import { program } from 'commander';
import { update } from './commands.js'; // Note .js extension

program
  .version('1.0.0')
  .command('update')
  .action(update);

program.parse(process.argv);
