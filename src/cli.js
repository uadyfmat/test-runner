#!/usr/bin/env node

const TestRunner = require("./index");

// Parse command line arguments
const argv = require("yargs")(process.argv.slice(2))
  .usage("Usage: test-runner [options] [dir]")
  .command("* [dir]", false, (command) => {
    command
      .positional("dir", {
        description: `Compliant coding exercise directory (i.e. has two files: a
          Solution.{java|py|c|cpp} and a spec.inout)`,
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
  .wrap(80)
  .locale("en").argv;

TestRunner.run({
  targetDirectory: argv.dir,
  errorOnTestFail: argv.errorOnTestFail,
});
