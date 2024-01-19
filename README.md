# Apply Jira Labels

Given a Jira label as input, copy the labels on that issue to the GitHub PR.

## About

This action is configured "ready to go" out of the box.

**Inputs**:

- `jira_ticket_id`
- `jira_api_url`
- `jira_api_email`
- `jira_api_key`
- `specific_labels`

## Contributing

You need to install the `node_modules` dependencies locally. To do so run the following **from this directory**:
```
~$ npm install
```
To build:
```
~$ npm run build
```
This will bundle your code into a folder containing a minified version of the source code.