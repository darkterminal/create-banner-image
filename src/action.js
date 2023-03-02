const core = require('@actions/core');
const github = require('@actions/github');
const { actionGenerateImage } = require('./generator')

const runtime = async () => {
    try {
        var name = 'github-actions'
        var email = '41898282+github-actions[bot]@users.noreply.github.com'

        const githubToken = core.getInput('github-token', { required: true });
        const canonicalName = core.getInput('canonical-name', { required: true });
        const gradientColors = core.getInput('gradient-colors', { required: true });
        const articleName = core.getInput('article-name', { required: true });
        const articleCategory = core.getInput('article-category', { required: true });
        const emoji = core.getInput('emoji', { required: true });

        const client = github.getOctokit(githubToken)
        const context = github.context

        const base64image = await actionGenerateImage(canonicalName, gradientColors.split(','), articleName, articleCategory, emoji)

        const createContent = await client.rest.repos.createOrUpdateFileContents({
            owner: context.issue.owner,
            repo: context.issue.repo,
            path: `images/${canonicalName}.png`,
            message: `build(image-generator): commit from gitHub actions (${process.env.GITHUB_WORKFLOW})`,
            content: base64image,
            committer: {
                name: name,
                email: email
            },
            author: {
                name: name,
                email: email
            }
        })
        console.log('Content Created', createContent)
    } catch (error) {
        core.setFailed(error.message);
    }
}
runtime()