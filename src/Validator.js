const ErrorMessages = require("./ErrorMessages");
const config = require("./config");

const fs = require("fs");
const path = require("path");

function Validator() {}

Validator.performAllValidations = function (targetDirectory) {
  let errors = {};

  errors = validateTargetDirExists(targetDirectory);
  printAndExitOnError(errors);

  if (config.setAtRuntime.targetLanguage) {
    errors = validateTargetLanguageIsSupported(
      config.setAtRuntime.targetLanguage
    );
    printAndExitOnError(errors);
  }

  errors = validateTargetDirContents(targetDirectory);
  printAndExitOnError(errors);
};

function printAndExitOnError(errors) {
  if (errors.hasErrors()) {
    console.error(`Exercise: ${config.setAtRuntime.exerciseName}`);
    console.error("Errors attempting to run the exercise:");
    console.error(errors.toString());
    process.exit(config.setAtRuntime.enableErrorExitCode ? 1 : 0);
  }
}

function validateTargetDirExists(targetDirectory) {
  const absolutePathTargetDir = path.resolve(targetDirectory);
  const errors = new ErrorMessages();

  if (!fs.existsSync(targetDirectory)) {
    errors.addError(
      "Target directory does not exist.\n" +
        `  Target directory: ${absolutePathTargetDir}`
    );
  }

  return errors;
}

function validateTargetLanguageIsSupported(targetLanguage) {
  const errors = new ErrorMessages();

  if (!config.supportedLanguages.includes(targetLanguage)) {
    errors.addError(
      `Target language '${targetLanguage}' is not supported.\n` +
        `  Supported languages: ${config.supportedLanguages}`
    );
  }

  return errors;
}

function validateTargetDirContents(targetDirectory) {
  const absolutePathTargetDir = path.resolve(targetDirectory);
  const errors = new ErrorMessages();

  if (
    !fs.existsSync(path.join(targetDirectory, config.requiredFiles.testCases))
  ) {
    errors.addError(
      `${config.requiredFiles.testCases} is not present in target directory.\n` +
        `  Target directory: ${absolutePathTargetDir}`
    );
  }

  let validSolutionFileExists = false;

  const targetSolutionFileExtensions = config.setAtRuntime.targetLanguage
    ? [config.setAtRuntime.targetLanguage]
    : config.supportedLanguages;

  for (extension of targetSolutionFileExtensions) {
    if (
      fs.existsSync(
        path.join(
          targetDirectory,
          `${config.requiredFiles.solutionFileName}.${extension}`
        )
      )
    ) {
      validSolutionFileExists = true;
      break;
    }
  }

  if (!validSolutionFileExists) {
    if (config.setAtRuntime.targetLanguage) {
      errors.addError(
        `Solution file of language '${config.setAtRuntime.targetLanguage}' was not found in target directory.\n` +
          `  Target directory: ${absolutePathTargetDir}`
      );
    } else {
      errors.addError(
        `Solution file of a supported language is not present in target directory.\n` +
          `  Target directory: ${absolutePathTargetDir}\n` +
          `  Supported laguages: ${config.supportedLanguages}`
      );
    }
  }

  return errors;
}

module.exports = Validator;
