const { execSync } = require('child_process');

async function isCommitPartOfPullRequest(owner, repo, commit_sha) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${commit_sha}/pulls`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.groot-preview+json',
      Authorization: `token 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`, // personal access token with repo pull request scope. Access terminated on `Fri, Dec 13 2024` !
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with status code ${response.status}`);
  }

  const data = await response.json();
  return data.length > 0;
}

// Get the current branch name
const branch_name = execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf8',
}).trim();

// Check if the branch is 'main' or 'staging'
if (branch_name === 'main' || branch_name === 'staging') {
  // If it is, exit with 0 to not ignore the build
  console.log(
    `This commit is part of "${branch_name}" so the build can proceed.`,
  );
  process.exit(1);
} else {
  // If it's not, get the current commit SHA
  const commit_sha = execSync('git rev-parse HEAD', {
    encoding: 'utf8',
  }).trim();

  // Check if the current commit is part of a pull request
  isCommitPartOfPullRequest('Offline-Project', 'marketplace', commit_sha)
    .then((isPart) => {
      if (isPart) {
        console.log(`This commit is part of a PR so the build can proceed.`);
        process.exit(1);
      } else {
        console.log(
          `This commit is not part of a PR so the build will be ignored.`,
        );
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error(err);
      process.exit(0);
    });
}
