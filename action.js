import JiraApi from 'jira-client';
const core = require('@actions/core')
const github = require('@actions/github')

try {
  const jira_ticket_id = core.getInput("jira_ticket_id", { required: true })
  const jira_api_url = core.getInput("jira_api_url", { required: true })
  const jira_api_email = core.getInput("jira_api_email", { required: true })
  const jira_api_key = core.getInput("jira_api_key", { required: true })
  const specific_labels = core.getInput("specific_labels", { required: false })
  const token = core.getInput("repo-token", { required: true });

  const jira = new JiraApi({
    protocol: 'https',
    host: jira_api_url,
    username: jira_api_email,
    password: jira_api_key,
    apiVersion: '2',
    strictSSL: true
  });

  core.info(`Looking for issue ${jira_ticket_id}`);

  const issue = await jira.findIssue(jira_ticket_id);

  core.info(`Jira issue found`);

  var labels = []

  if (specific_labels) {
    core.info(`Checking for Specific Labels: ${specific_labels} in ticket labels ${issue.fields.labels}`)
    const specific_labels_array = specific_labels.split(',')

    labels = specific_labels_array.filter(specific_label => issue.fields.labels.find(label => label == specific_label))
                                  .map(function(label) {
                                    return label.replace(/_/g, " ")
                                  });
  } else {
    core.info(`Getting all labels`)
    labels = issue.fields.labels
      .map(function(label) {
        return label.name.replace ('_', ' ');
    });
  }

  if (labels && labels.length) {
    core.info(`Trying to apply labels ${labels}`)

    const payload = github.context.payload;
    const pull_request = payload.pull_request;
    const prNumber = pull_request.number;

    const githubClient = github.getOctokit(token);

    await githubClient.rest.issues.addLabels({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.pull_request.number,
      labels: labels,
    }); 
    
    core.info(`Labels applied?`)
  } else {
    core.info(`No labels found to apply`)
  }

} catch (error) {
  core.setFailed(error)
}
