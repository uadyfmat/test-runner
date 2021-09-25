// Steps:
// - Parse spec.inout.
// - Test Solution.{ext} against every entry in spec.inout.
// - Print the testing results into readable format.

const SpecParser = require("./SpecParser");
const Validator = require("./Validator");
const config = require("./config");
const { concatMultipleTimes, getExerciseHeading } = require("./util");

const path = require("path");

const shell = require("shelljs");
const LeTable = require("le-table");

function TestRunner() {}

TestRunner.prototype.run = function (targetDirectory, isShortOutputEnabled) {
  Validator.performAllValidations(targetDirectory);

  const parsedSpec = new SpecParser().parseSpec(
    path.join(targetDirectory, config.requiredFiles.testCases)
  );
  const testResults = testSolution(parsedSpec, targetDirectory);

  const summaryOneLineResults = generateSummaryOneLineOutput(testResults);
  const summaryTableResults = generateSummaryTableOutput(testResults);

  console.log(getExerciseHeading());
  console.log(summaryTableResults);
  if (!isShortOutputEnabled) {
    printVerboseResults(parsedSpec, testResults);
  }
  console.log(summaryOneLineResults);

  process.exit(determineExitCode(testResults));
};

function testSolution(parsedSpec, targetDirectory, ignoreEndingNewLine = true) {
  const testResults = [];

  const targetLanguages = config.setAtRuntime.targetLanguage
    ? [config.setAtRuntime.targetLanguage]
    : config.supportedLanguages.join("|");

  // Find solution file
  const solutionFile = shell.exec(
    `bash '${__dirname}/shell/find-entry' '${targetDirectory}' "${targetLanguages}"`,
    { silent: true }
  ).stdout;

  // Compile (if necessary) the solution file
  const compilationResult = shell.exec(
    `bash '${__dirname}/shell/compile' '${targetDirectory}' ${solutionFile}`,
    { silent: true }
  );

  // Show compilation errors
  if (compilationResult.stderr !== "") {
    console.error(getExerciseHeading());
    console.error(compilationResult.stderr);
    process.exit(config.setAtRuntime.enableErrorExitCode ? 1 : 0);
  }

  for (let testCase of parsedSpec) {
    // Run the solution file
    const runtimeResult = shell
      .exec(`printf '${testCase.in.replace(/\n/g, "\\n")}'`, { silent: true })
      .exec(
        `bash '${__dirname}/shell/run' '${targetDirectory}' ${solutionFile}`,
        { silent: true }
      );

    // Show runtime errors
    if (runtimeResult.stderr !== "") {
      console.error(getExerciseHeading());
      console.error(runtimeResult.stderr);
      process.exit(config.setAtRuntime.enableErrorExitCode ? 1 : 0);
    }

    let actualOutput = runtimeResult.stdout.replace(/\r/g, "");
    let expectedOutput = testCase.out;

    if (ignoreEndingNewLine) {
      actualOutput = actualOutput.replace(/(\r?\n)$/g, "");
      expectedOutput = expectedOutput.replace(/(\r?\n)$/g, "");
    }

    testResults.push({ status: actualOutput === expectedOutput, actualOutput });
  }

  // Clean compilation files, if any
  shell.exec(`bash '${__dirname}/shell/clean' '${targetDirectory}'`, {
    silent: true,
  });

  return testResults;
}

function determineExitCode(testResults) {
  if (config.setAtRuntime.enableErrorExitCode) {
    return testResults.find((result) => result.status === false) === undefined
      ? 0
      : 1;
  }
  return 0;
}

function generateSummaryOneLineOutput(testResults) {
  const testsRun = testResults.length;
  const successes = testResults.filter(
    (result) => result.status === true
  ).length;

  let areAllTestsPassing = successes === testResults.length;
  const congratsMessage = "🦄🌟🎉🦄🌟🎉";

  return `Passing tests: ${successes}/${testsRun} ${
    areAllTestsPassing ? congratsMessage : ""
  }`;
}

function generateSummaryTableOutput(testResults) {
  const heading = ["#", "Status"];
  const rows = [];

  for (let i = 0; i < testResults.length; i++) {
    // See StackOverflow answer for console colors:
    // https://stackoverflow.com/a/41407246/12591546
    const status = testResults[i].status
      ? "\x1b[1m\x1b[32mPASSING\x1b[0m\x1b[0m"
      : "\x1b[1m\x1b[31mFAILING\x1b[0m\x1b[0m";
    rows.push([i + 1, status]);
  }

  const table = new LeTable();

  table.addRow(heading);
  for (let row of rows) {
    table.addRow(row);
  }

  return table.stringify();
}

function printVerboseResults(parsedSpec, testResults) {
  const rightPadding = concatMultipleTimes(" ", 30);

  for (let i = 0; i < parsedSpec.length; i++) {
    const table = new LeTable();

    const status = testResults[i].status
      ? `\x1b[1m\x1b[32mPASSING${rightPadding}\x1b[0m\x1b[0m`
      : `\x1b[1m\x1b[31mFAILING${rightPadding}\x1b[0m\x1b[0m`;
    table.addRow([`#${i + 1}`, status]);

    table.addRow(["Input", parsedSpec[i].in]);
    table.addRow(["Expected\noutput", parsedSpec[i].out]);

    if (testResults[i].status === false) {
      table.addRow(["Actual\noutput", testResults[i].actualOutput]);
    }

    console.log(table.stringify());
  }
}

module.exports = TestRunner;
