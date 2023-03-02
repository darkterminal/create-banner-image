const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
      console.log('Hello word!')
    } catch (error) {
      core.setFailed(error.message);
    }
  })()