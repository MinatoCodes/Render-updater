#!/usr/bin/env node
import { program } from 'commander';
import http from 'http';

// Your existing CLI logic
program
  .command('update')
  .action(() => {
    console.log("Running repository update...");
    // Your update logic here
  });

// Minimal web server for Render
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("CLI tool is running");
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Fake web server running on port ${server.address().port}`);
  program.parse(process.argv); // Start your CLI
});
