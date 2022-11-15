const { auth } = require("../../secret/GithubConfig.json");
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({auth: auth})
module.exports.octokit = octokit;

exports.workflowDispatch = async (setting) => {
    await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', setting)
}