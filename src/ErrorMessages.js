function ErrorMessages() {
  this.errors = [];
}

ErrorMessages.prototype.addError = function (error) {
  this.errors.push(error);
};

ErrorMessages.prototype.getErrors = function () {
  return this.error;
};

ErrorMessages.prototype.hasErrors = function () {
  return this.errors.length > 0;
};

ErrorMessages.prototype.toString = function () {
  let message = "";

  for (error of this.errors) {
    message = message.concat(`- ${error}\n`);
  }

  return message;
};

module.exports = ErrorMessages;
