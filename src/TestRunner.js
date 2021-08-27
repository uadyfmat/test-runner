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

const shell = require("shelljs");
const LeTable = require("le-table");

const SpecParser = require("./SpecParser");

const SPEC_FILE_PATH = "./src/spec.inout";

function testSolution(parsedSpec, ignoreEndingNewLine = true) {
  const testResults = [];

  for (let testCase of parsedSpec) {
    const result = shell
      .exec(`printf '${testCase.in.replace(/\n/g, "\\n")}'`, {
        silent: true,
      })
      .exec("bash ./run", {
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

function determineExitCode(testResults) {
  return testResults.find((result) => result === false) === false ? 1 : 0;
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

function main() {
  const parsedSpec = SpecParser.parseSpec(SPEC_FILE_PATH);
  const testResults = testSolution(parsedSpec);
  const printableResults = generateAsciiTableOutput(parsedSpec, testResults);

  console.log(printableResults); // Print results in readable form.

  process.exit(determineExitCode(testResults));
}

main();
