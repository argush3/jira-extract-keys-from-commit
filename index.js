const core = require('@actions/core');
const github = require('@actions/github');
const matchAll = require("match-all");


async function extractJiraKeysFromCommit() {
    try {

        const commitMessage = core.getInput('commit-message');
        console.log("commitMessage: " + commitMessage);
        const parseAllCommits = core.getInput('parse-all-commits');
        console.log("parseAllCommits: " + parseAllCommits);

        if(commitMessage) {
            console.log("commit-message input val provided...");
            const matches = matchAll(commitMessage, /([A-Z]+-\d+)/g).toArray();
            const result = matches.join(',');
            console.log("result: ", result);
            core.setOutput("jira-keys", result);
        }
        else {
            console.log("no commit-message input val provided...");
            const payload = JSON.stringify(github.context.payload, undefined, 2);
            console.log("github context payload: ", payload);

            if(parseAllCommits === true) {
                console.log("parse-all-commits input val is true");

                core.setOutput("jira-keys", "");
            }
            else {
                console.log("parse-all-commits input val is false");

                core.setOutput("jira-keys", "");
            }

        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

(async function () {
    await extractJiraKeysFromCommit();
    console.log("finished extracting jira keys from commit message");
})();
