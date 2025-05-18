cat > commands.js <<'EOL'
const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const CONFIG = {
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH || "auto-updates",
  patterns: require('./allowed-patterns.json'),
  dryRun: process.env.DRY_RUN === 'true'
};

async function updateFiles() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  let updated = 0;

  try {
    // Get all files recursively
    const { data: files } = await octokit.rest.repos.getContent({
      owner: CONFIG.owner,
      repo: CONFIG.repo,
      ref: CONFIG.branch
    });

    // Process files
    for (const file of files.filter(f => !f.download_url)) {
      if (CONFIG.patterns.some(p => file.path.includes(p))) {
        const { data: content } = await octokit.repos.getContent({
          owner: CONFIG.owner,
          repo: CONFIG.repo,
          path: file.path,
          ref: CONFIG.branch
        });

        const newContent = Buffer.from(content.content, 'base64').toString() + 
                         `\n\n<!-- Updated: ${new Date().toISOString()} -->`;

        if (!CONFIG.dryRun) {
          await octokit.repos.createOrUpdateFileContents({
            owner: CONFIG.owner,
            repo: CONFIG.repo,
            path: file.path,
            branch: CONFIG.branch,
            message: `Auto-update ${file.path}`,
            content: Buffer.from(newContent).toString('base64'),
            sha: content.sha
          });
        }

        console.log(`${CONFIG.dryRun ? 'Would update' : 'Updated'}: ${file.path}`);
        updated++;
      }
    }

    console.log(`\n✅ ${updated} files processed (Dry Run: ${CONFIG.dryRun})`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

module.exports = { updateFiles };
EOL
