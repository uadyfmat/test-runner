#!/usr/bin/env node

const TestRunner = require("./index");
const config = require("./config");

// Parse command line arguments
const argv = require("yargs")(process.argv.slice(2))
  .usage("Usage: test-runner [options] [dir]")
  .command("* [dir]", false, (command) => {
    command
      .positional("dir", {
        description: `Compliant coding exercise directory (i.e. has two files: a
          ${config.requiredFiles.solutionFileName}.{${config.supportedLanguages}} and a ${config.requiredFiles.testCases})`,
        type: "string",
        default: ".",
      })
      .option("e", {
        alias: "enable-error-exit-code",
        description: `Finish with exit code 1 when a test case fails,
          a compilation or interpretation error happens,
          or a required file is missing. When this option
          is not set, always finish with 0.`,
        type: "boolean",
        default: false,
      });
  })
  .help()
  .wrap(80)
  .locale("en").argv;

TestRunner.run({
  targetDirectory: argv.dir,
  enableErrorExitCode: argv.enableErrorExitCode,
});
