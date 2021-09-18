// Steps:
// - Parse spec.inout.
// - Test Solution.{ext} against every entry in spec.inout.
// - Print the testing results into readable format.

const SpecParser = require("./SpecParser");
const Validator = require("./Validator");
const config = require("./config");

const path = require("path");

const shell = require("shelljs");
const LeTable = require("le-table");

function TestRunner() {}

TestRunner.prototype.run = function (targetDirectory) {
  Validator.performAllValidations(targetDirectory);

  const parsedSpec = new SpecParser().parseSpec(
    path.join(targetDirectory, config.requiredFiles.testCases)
  );
  const testResults = testSolution(parsedSpec, targetDirectory);

  const exerciseHeading = getExerciseHeading();
  const summaryResults = generateSummaryResults(testResults);
  const fullResults = generateAsciiTableOutput(parsedSpec, testResults);

  console.log(exerciseHeading); // Print exercise heading
  console.log(summaryResults); // Print results summary
  console.log(fullResults); // Print full results

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
      console.error(runtimeResult.stderr);
      process.exit(config.setAtRuntime.enableErrorExitCode ? 1 : 0);
    }

    let actualOutput = runtimeResult.stdout.replace(/\r/g, "");
    let expectedOutput = testCase.out;

    if (ignoreEndingNewLine) {
      actualOutput = actualOutput.replace(/(\r?\n)$/g, "");
      expectedOutput = expectedOutput.replace(/(\r?\n)$/g, "");
    }

    testResults.push(actualOutput === expectedOutput);
  }

  // Clean compilation files, if any
  shell.exec(`bash '${__dirname}/shell/clean' '${targetDirectory}'`, {
    silent: true,
  });

  return testResults;
}

function determineExitCode(testResults) {
  if (config.setAtRuntime.enableErrorExitCode) {
    return testResults.find((result) => result === false) === false ? 1 : 0;
  }
  return 0;
}

function generateAsciiTableOutput(parsedSpec, testResults) {
  const heading = ["#", "Input", "Output", "Passed"];
  const rows = [];

  for (let i = 0; i < parsedSpec.length; i++) {
    // See StackOverflow answer for console colors:
    // https://stackoverflow.com/a/41407246/12591546
    const passed = testResults[i] ? "\x1b[32mYES\x1b[0m" : "\x1b[31mNO\x1b[0m";
    rows.push([i + 1, parsedSpec[i].in, parsedSpec[i].out, passed]);
  }

  const table = new LeTable();

  table.addRow(heading);
  for (let row of rows) {
    table.addRow(row);
  }

  return table.stringify();
}

function generateSummaryResults(testResults) {
  const testsRun = testResults.length;
  const failures = testResults.filter((result) => result === false).length;

  return `Tests run: ${testsRun}, Failures: ${failures}`;
}

function getExerciseHeading() {
  return `Exercise: ${config.setAtRuntime.exerciseName}`;
}

module.exports = TestRunner;
