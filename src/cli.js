#!/usr/bin/env node

const TestRunner = require("./index").TestRunner;

// Parse command line arguments
const argv = require("yargs")(process.argv.slice(2))
  .usage("Usage: $0 [-e] [<dir>]")
  // Documentation of the options and paramenters
  .option("e", {
    alias: "error-out",
    description: "Finish with exit code 1 when a test case fails.",
    type: "boolean",
    default: false,
  })
  .positional("dir", {
    description: "Directory of a compliant coding exercise.",
    type: "string",
    default: ".",
  })
  // Add auto-help message and wrap at 100 chars
  .help()
  .wrap(100)
  .locale("en").argv;

console.log(argv);

TestRunner.run(argv.dir);
