#!/usr/bin/env node

const program = require('commander')
const run = require('./run')

// init
program
  .version(require('./package').version, '-v, --version')
  .command('init <name>')
  .action(run)
  .on('--help', () => {
    console.log(' Examples: ')
  })

program.parse(process.argv)
