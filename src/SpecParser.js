// Sample parsing result:
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
//
// Algorithm for parsing spec.inout into JSON:
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
// Data structures used in the algorithm:
//
// BLOCK_DELIMS_COUNTER (map)
// {
//   IN: 2,
//   OUT: 1
// }
//
// BLOCKS_OPENED (map)
// {
// OUT: "OUT"
// }
//
// BLOCK_DELIMS_SEQUENCE (list)
// ["IN", "IN", "OUT"]

const fs = require("fs");

const IN_BLOCK_DELIMITER = "//";
const OUT_BLOCK_DELIMITER = "$$";

function SpecParser() {}

// TODO: Validate spec.inout has correct format.
// This function takes for granted that the format is valid.
SpecParser.prototype.parseSpec = function (specFilePath) {
  const lines = fs
    .readFileSync(specFilePath, { encoding: "utf8" })
    .toString()
    .replace(/\r/g, "")
    .split("\n");

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
        currentInOutObject[openedBlockType] += `\n${line}`;
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
};

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

module.exports = SpecParser;
