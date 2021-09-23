const config = require("./config");

const path = require("path");

function concatMultipleTimes(substring, times) {
  let output = "";

  for (let i = 0; i < times; i++) {
    output = output.concat(substring);
  }

  return output;
}

function getExerciseName(targetDirectory) {
  return path.basename(path.resolve(targetDirectory));
}

function getExerciseHeading() {
  return `\nExercise: ${config.setAtRuntime.exerciseName}`;
}

module.exports = { concatMultipleTimes, getExerciseName, getExerciseHeading };
