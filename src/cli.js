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
        alias: "error-on-test-fail",
        description: "Finish with exit code 1 when a test case fails.",
        type: "boolean",
        default: false,
      });
  })
  .help()
  .wrap(105)
  .locale("en").argv;

TestRunner.run({
  targetDirectory: argv.dir,
  errorOnTestFail: argv.errorOnTestFail,
});
