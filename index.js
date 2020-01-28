const core = require('@actions/core');
const github = require('@actions/github');
const matchAll = require("match-all");
const Octokit = require("@octokit/rest");
const octokit = new Octokit();


async function extractJiraKeysFromCommit() {
    try {

        const regex = /([A-Z]+-\d+)/g;
        const githubToken = core.getInput('github-token');
        console.log("core.getInput('is-pull-request'): " + core.getInput('is-pull-request'));
        const isPullRequest = core.getInput('is-pull-request') == 'true';
        console.log("isPullRequest: " + isPullRequest);
        const commitMessage = core.getInput('commit-message');
        console.log("commitMessage: " + commitMessage);
        console.log("core.getInput('parse-all-commits'): " + core.getInput('parse-all-commits'));
        const parseAllCommits = core.getInput('parse-all-commits') == 'true';
        console.log("parseAllCommits: " + parseAllCommits);
        const jsonPayload = JSON.stringify(github.context.payload, undefined, 2);
        // console.log("github context json payload: ", jsonPayload);
        const payload = github.context.payload;
        console.log("github: ", github);

        if(isPullRequest) {
            console.log("is pull request");
            octokit.authenticate(githubToken);
            // const commits = octokit.repos.listCommits({
            //     owner,
            //     repo,
            //     pull_number
            // });
            core.setOutput("jira-keys", "");
        }
        else {
            console.log("not a pull request");

            if(commitMessage) {
                console.log("commit-message input val provided...");
                const matches = matchAll(commitMessage, regex).toArray();
                const result = matches.join(',');
                console.log("result: ", result);
                core.setOutput("jira-keys", result);
            }
            else {
                console.log("no commit-message input val provided...");
                const jsonPayload = JSON.stringify(github.context.payload, undefined, 2);
                // console.log("github context json payload: ", jsonPayload);
                const payload = github.context.payload;

                if(parseAllCommits) {
                    console.log("parse-all-commits input val is true");
                    let resultArr = [];

                    payload.commits.forEach(commit => {
                        // console.log("commit: ", commit);
                        const matches = matchAll(commit.message, regex).toArray();
                        matches.forEach(match => {
                            if(resultArr.find(element => element == match)) {
                                console.log(match + " is already included in result array");
                            } else {
                                console.log(" adding " + match + " to result array");
                                resultArr.push(match);
                            }
                        });

                    });

                    const result = resultArr.join(',');
                    console.log("result: ", result);
                    core.setOutput("jira-keys", result);
                }
                else {
                    console.log("parse-all-commits input val is false");
                    console.log("head_commit: ", payload.head_commit);
                    const matches = matchAll(payload.head_commit.message, regex).toArray();
                    const result = matches.join(',');
                    core.setOutput("jira-keys", result);
                }

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
