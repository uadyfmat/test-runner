#!/usr/bin/env node

const TestRunner = require("./index");
const config = require("./config");
const { getExerciseName } = require("./util");

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
          or a validation fails. When this option is not
          set, always finish with 0.`,
        type: "boolean",
        default: false,
      })
      .option("l", {
        alias: "language",
        description: `Indicate language of the solution file. Useful
        to pick a file when solution files of various
        languages are present in the target directory.
        Values: ${config.supportedLanguages.join(", ")}
        Example: test-runner -l py .`,
        type: "string",
      });
  })
  .help()
  .wrap(80)
  .locale("en").argv;

config.setAtRuntime.enableErrorExitCode = argv.enableErrorExitCode;
config.setAtRuntime.targetLanguage = argv.language;
config.setAtRuntime.exerciseName = getExerciseName(argv.dir);

new TestRunner().run(argv.dir);
