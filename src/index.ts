import process from 'process'

import createClient from '@dylibso/xtp'

import { GUEST_KEY, APP_ID, TOKEN, WORKING_DIR } from './env'
import { Repo } from './repo'

async function run() {
  process.chdir(WORKING_DIR);

  const repo = new Repo();
  
  const client = await createClient({
    appId: APP_ID,
    token: TOKEN,
    useWasi: true,
    runInWorker: true,
    config: {
      "GIT_SHA": repo.sha,
      "GIT_BRANCH": repo.branch,
    },
    allowedPaths: {
      ".": "."
    },
    functions: repo.getFunctions()
  });

  console.log(await client.extensionPoints["xtp-ci"].checkRepo(GUEST_KEY, "test", {default: ""}));
}

run()
