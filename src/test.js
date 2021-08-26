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

const SPEC_FILE_PATH = "./src/spec.inout";

/* ------------------------------ */
/* --- File parsing functions --- */
/* ------------------------------ */

const IN_BLOCK_DELIMITER = "//";
const OUT_BLOCK_DELIMITER = "$$";

function onBlockDelimiterFound({
  blockDelimiter,
  blockDelimsCounter,
  blocksDelimsOpened,
  blocksDelimsSequence,
}) {
  blockDelimsCounter.set(
    blockDelimiter,
    blockDelimsCounter.get(blockDelimiter) + 1
  );

  if (blockDelimsCounter.get(blockDelimiter) % 2 == 1) {
    blocksDelimsOpened.set(blockDelimiter, blockDelimiter);
  } else {
    blocksDelimsOpened.delete(blockDelimiter);
  }

  blocksDelimsSequence.push(blockDelimiter);
}

/**
 * Return true when an IN_DELIMITER is not preceded by an IN_DELIMITER.
 * Return false otherwise.
 *
 * @param {string} currentLine
 * @param {Array} blocksDelimsSequence
 */
function shouldCreateNewInOutObject(currentLine, blocksDelimsSequence) {
  const amountOfDelims = blocksDelimsSequence.length;

  if (
    currentLine === IN_BLOCK_DELIMITER &&
    blocksDelimsSequence[amountOfDelims - 1] === IN_BLOCK_DELIMITER &&
    blocksDelimsSequence[amountOfDelims - 2] === OUT_BLOCK_DELIMITER
  ) {
    return true;
  }

  return false;
}

/**
 * Return the single opened block type, where types are:
 * - In block: "in"
 * - Out block: "out"
 * The function assumes that there always is exactly one opened block.
 *
 * @param {Map} blocksDelimsOpened
 */
function getOpenedBlockType(blocksDelimsOpened) {
  const delimiterOpened = blocksDelimsOpened.keys().next().value;

  if (delimiterOpened === IN_BLOCK_DELIMITER) {
    return "in";
  }
  if (delimiterOpened === OUT_BLOCK_DELIMITER) {
    return "out";
  }

  return undefined;
}

// TODO: Validate spec.inout has correct format
function parseSpec(specFilePath) {
  const lines = fs
    .readFileSync(specFilePath, { encoding: "utf8" })
    .toString()
    .split("\n");

  // Steps:
  // - Read each line.
  //   - If it's IN_DELIM, then BLOCK_DELIMS_COUNTER.IN++
  //   - If it's OUT_DELIM, then BLOCK_DELIMS_COUNTER.OUT++
  //     (For either case, update BLOCKS_OPENED and BLOCK_DELIMS_SEQUENCE
  //     after every update to BLOCK_DELIMS_COUNTER).
  //
  //     - Update BLOCKS_OPENED: If current delim number is odd,
  //       then its open, add it to the map. If its even, remove
  //       it from the map.
  //     - Update BLOCK_DELIMS_SEQUENCE: Push the last delim found.
  //
  //   - If it's neither of them, add the line to an object's
  //     key named "in" (for IN_DELIM) or "out" (for OUT_DELIM),
  //     depending on the current opened block.
  //
  // - On every BLOCKS_OPENED update, validate if its valid (i.e.
  //   it is a sequence "IN", "IN", "OUT", "OUT", etc.).If it is,
  //   when "IN" is not precedec by "OUT", and current line is an
  //   "IN", create new inOut object.
  //
  // Validation (performed after every block delim encounter):
  // - Every block is closed.
  // - No two consecutive blocks are of the same type.
  // - An IN block always comes before an OUT block.
  //
  // Leeway:
  // - Empty lines are allowed.
  // - Text outside of blocks is allowed (is ignored).
  //
  // Data structures:
  //
  // BLOCK_DELIMS_COUNTER
  // {
  //   IN: 2,
  //   OUT: 1
  // }
  //
  // // BLOCKS_OPENED
  // {
  // OUT: "OUT"
  // }
  //
  // // BLOCK_DELIMS_SEQUENCE
  // ["IN", "IN", "OUT"]

  const parsedSpec = [];
  let currentInOutObject = {};

  const blockDelimsCounter = new Map();
  const blocksDelimsOpened = new Map();
  const blocksDelimsSequence = [];

  blockDelimsCounter.set(IN_BLOCK_DELIMITER, 0);
  blockDelimsCounter.set(OUT_BLOCK_DELIMITER, 0);

  for (let line of lines) {
    if (line === IN_BLOCK_DELIMITER) {
      onBlockDelimiterFound({
        blockDelimiter: IN_BLOCK_DELIMITER,
        blockDelimsCounter,
        blocksDelimsOpened,
        blocksDelimsSequence,
      });
    } else if (line === OUT_BLOCK_DELIMITER) {
      onBlockDelimiterFound({
        blockDelimiter: OUT_BLOCK_DELIMITER,
        blockDelimsCounter,
        blocksDelimsOpened,
        blocksDelimsSequence,
      });
    } else {
      if (line === "") continue; // Allow empty lines

      const openedBlockType = getOpenedBlockType(blocksDelimsOpened);

      if (openedBlockType === undefined) continue; // Allow text outside of a block

      if (currentInOutObject.hasOwnProperty(openedBlockType)) {
        currentInOutObject[openedBlockType] += line;
      } else {
        currentInOutObject[openedBlockType] = line;
      }
    }

    if (shouldCreateNewInOutObject(line, blocksDelimsSequence)) {
      parsedSpec.push(Object.assign({}, currentInOutObject));
      currentInOutObject = {};
    }
  }

  // Append last out block
  parsedSpec.push(Object.assign({}, currentInOutObject));

  return parsedSpec;
}

/* --------------------------- */
/* --- Auxiliary functions --- */
/* --------------------------- */

function testSolution(parsedSpec, ignoreEndingNewLine = true) {
  const testResults = [];

  for (let testCase of parsedSpec) {
    const result = shell.exec(`echo ${testCase.in} | bash ./run`, {
      silent: true,
    });

    // Show compilation or interpretation errors
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

/* ---------------------- */
/* --- Execution flow --- */
/* ---------------------- */

function main() {
  const parsedSpec = parseSpec(SPEC_FILE_PATH);
  const testResults = testSolution(parsedSpec);
  const printableResults = generateAsciiTableOutput(parsedSpec, testResults);

  console.log(printableResults); // Print results in readable form.

  process.exit(determineExitCode(testResults));
}

main();
