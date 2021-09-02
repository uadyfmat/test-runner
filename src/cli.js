#!/usr/bin/env node

const TestRunner = require("./index").TestRunner;

// Parse command line arguments
const argv = require("yargs")(process.argv.slice(2))
  .usage("Usage: $0 [options] [dir]")
  .command("* [dir]", false, (command) => {
    command
      .positional("dir", {
        description: "Directory of a compliant coding exercise.",
        type: "string",
        default: ".",
      })
      .option("e", {
        alias: "error-out",
        description: "Finish with exit code 1 when a test case fails.",
        type: "boolean",
        default: false,
      });
  })
  // Add auto-help message and wrap at 100 chars
  .help()
  .wrap(100)
  .locale("en").argv;

TestRunner.run(argv.dir);
