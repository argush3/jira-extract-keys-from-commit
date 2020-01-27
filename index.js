const core = require('@actions/core');
const github = require('@actions/github');
const matchAll = require("match-all");

try {
    const commitMessage = core.getInput('commit-message');
    console.log("commitMessage: " + commitMessage);

    const matches = matchAll(commitMessage, /([A-Z]+-\d+)/g).toArray();
    const result = matches.join(',');
    console.log("result: ", result);

    core.setOutput("jira-keys", result);
} catch (error) {
    core.setFailed(error.message);
}