const semver = require("semver");
const { NODE_ENGINES } = require("../constants");

const messages = {
  visitTroubleshootingPage:
    "Please visit the troubleshooting page https://dev.salla.sa/",
  submitGithubIssue:
    "If this error persists, please visit https://github.com/sallaapp/salla-cli/issues and submit an issue.",
};

/**
 * @param {Error} error
 * @param {Array<{message: string}>} [error.messages]
 * @returns {void}
 */
function printCliResultError(error) {
  console.log(`\n\n${"not ok".red} -- ${error || "Unknown error"}\n`);

  if (error && Array.isArray(error.messages)) {
    for (const item of error.messages) {
      if (item && item.message) {
        console.log(`${item.message.red}\n`);
      }
    }
  }

  console.log(messages.visitTroubleshootingPage);
  console.log(messages.submitGithubIssue);
}

/**
 * @param {Error} error
 * @returns {void}
 */
function printCliResultErrorAndExit(error) {
  printCliResultError(error);
  // Exit with error code so automated systems recognize it as a failure
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

function checkNodeVersion() {
  const satisfies = semver.satisfies(
    process.versions.node,
    NODE_ENGINES
  );

  if (!satisfies) {
    throw new Error(
      `You are running an unsupported version of node. Please upgrade to ${NODE_ENGINES}`
    );
  }

  return satisfies;
}

module.exports = {
  messages,
  printCliResultError,
  printCliResultErrorAndExit,
  checkNodeVersion,
};
