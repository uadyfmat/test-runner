// Steps:
// - Parse spec.inout.
// - Test Solution.{ext} against every entry in spec.inout.
//   this uses run to execute the solution file.
// - Print the testing results into readable format.

// Parsed spec.inout:
// [
//   {
//     in: "Amor a Roma",
//     out: "yes",
//   },
//   {
//     in: "La casa es grande\nSalida a la casa",
//     out: "yes\nno",
//   },
// ];

// Results in readable format:
// ┌─┬──────────────────┬──────────────────┬──────────────────┐
// │#│Input             │Output            │Passed            │
// ├─┼──────────────────┼──────────────────┼──────────────────┤
// │1│Amor a Roma       │yes               │YES               │
// ├─┼──────────────────┼──────────────────┼──────────────────┤
// │2│Amor a Roma       │yes               │YES               │
// │ │Salida a la casa  │no                │                  │
// └─┴──────────────────┴──────────────────┴──────────────────┘
// See: https://www.npmjs.com/package/le-table

const path = require("path");

const shell = require("shelljs");
const LeTable = require("le-table");

const SpecParser = require("./SpecParser");

function testSolution(parsedSpec, targetDirectory, ignoreEndingNewLine = true) {
  const testResults = [];

  for (let testCase of parsedSpec) {
    const result = shell
      .exec(`printf '${testCase.in.replace(/\n/g, "\\n")}'`, {
        silent: true,
      })
      .exec(`bash ${__dirname}/run ${targetDirectory}`, {
        silent: true,
      });

    // Show compilation or interpretation errors
    if (result.stderr !== "") {
      console.error(result.stderr);
      process.exit(1);
    }

    let actualOutput = result.stdout.replace(/\r/g, "");
    let expectedOutput = testCase.out;

    if (ignoreEndingNewLine) {
      actualOutput = actualOutput.replace(/(\r?\n)$/g, "");
      expectedOutput = expectedOutput.replace(/(\r?\n)$/g, "");
    }

    testResults.push(actualOutput === expectedOutput);
  }

  return testResults;
}

function determineExitCode(testResults, errorOnTestFail) {
  if (errorOnTestFail) {
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

function getExerciseHeading(targetDirectory) {
  return `Exercise: ${path.basename(path.resolve(targetDirectory))}`;
}

function run({ targetDirectory, errorOnTestFail }) {
  const parsedSpec = SpecParser.parseSpec(
    path.join(targetDirectory, "spec.inout")
  );
  const testResults = testSolution(parsedSpec, targetDirectory);
  const exerciseHeading = getExerciseHeading(targetDirectory);
  const summaryResulsts = generateSummaryResults(testResults);
  const fullResults = generateAsciiTableOutput(parsedSpec, testResults);

  console.log(exerciseHeading); // Print exercise heading
  console.log(summaryResulsts); // Print results summary
  console.log(fullResults); // Print full results

  process.exit(determineExitCode(testResults, errorOnTestFail));
}

module.exports = { run };
