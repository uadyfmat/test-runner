const config = require("./config");

const path = require("path");

function getExerciseName(targetDirectory) {
  return path.basename(path.resolve(targetDirectory));
}

function getExerciseHeading() {
  return `Exercise: ${config.setAtRuntime.exerciseName}`;
}

module.exports = { getExerciseName, getExerciseHeading };
