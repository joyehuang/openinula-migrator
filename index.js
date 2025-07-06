#!/usr/bin/env node

const { program } = require('commander');
const { exec } = require('child_process');
const path = require('path');

// --- CLI Definition ---

program
  .version('0.0.1')
  .description('A CLI tool to migrate openInula v1 projects to v2');

// --- 'migrate' Command ---

program
  .command('migrate <targetPath>')
  .description('Migrate a file or directory using a specified codemod transform')
  .option('-d, --dry-run', 'Perform a dry run without writing changes to the file system')
  .action((targetPath, options) => {
    console.log(`Starting migration for: ${targetPath}`);

    // --- Path Definitions ---
    const transformScript = path.resolve(__dirname, './transforms/transform-useState.js');
    const jscodeshiftExecutable = path.resolve(__dirname, './node_modules/.bin/jscodeshift');

    // --- Command Execution ---
    // For a dry run, use -d (dry run) and --print (print to stdout).
    const flags = options.dryRun ? '-d --print' : '';

    const command = `${jscodeshiftExecutable} -t ${transformScript} ${targetPath} ${flags}`;

    console.log(`Executing: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration failed: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      console.log(`stdout:\n${stdout}`);
    });
  });

// --- Parse Arguments ---

program.parse(process.argv);