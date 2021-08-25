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
//     in: "La casa es grande",
//     out: "no",
//   },
// ];

// Results in readable format:
// .-----------------------------------------.
// | # | Input             | Output | Passed |
// |---|-------------------|--------|--------|
// | 1 | Amor a Roma       | yes    | ✔️    |
// | 2 | La casa es grande | no     | ❌    |
// '-----------------------------------------'
// See: https://www.npmjs.com/package/ascii-table

const fs = require("fs");
const shell = require("shelljs");
const AsciiTable = require("ascii-table");

const specFilePath = "./spec.inout";

function parseSpec(specFilePath) {
  const content = fs.readFileSync(specFilePath, { encoding: "utf8" });
  return JSON.parse(content);
}

function testSolution(parsedSpec, ignoreEndingNewLine = true) {
  const testResults = [];

  for (let testCase of parsedSpec) {
    const result = shell.exec(`echo ${testCase.in} | sh ./run`, {
      silent: true,
    });

    if (result.stderr !== "") {
      console.error(result.stderr);
      process.exit(1);
    }

    let actualOutput = result.stdout;
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
  const rows = [];

  for (let i = 0; i < parsedSpec.length; i++) {
    const passed = testResults[i] ? "✔️" : "❌";
    rows.push([i + 1, parsedSpec[i].in, parsedSpec[i].out, passed]);
  }

  const table = AsciiTable.factory({
    heading: ["#", "Input", "Output", "Passed"],
    rows,
  });

  return table.toString();
}

function main() {
  const parsedSpec = parseSpec(specFilePath);
  const testResults = testSolution(parsedSpec);
  const printableResults = generateAsciiTableOutput(parsedSpec, testResults);

  console.log(printableResults); // Print results in readable form.

  process.exit(determineExitCode(testResults));
}

main();
