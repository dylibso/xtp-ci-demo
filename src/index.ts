import process from 'process'

import createClient from '@dylibso/xtp'

import { GUEST_KEY, APP_ID, TOKEN, WORKING_DIR } from './env'
import { Repo } from './repo'
import walk from 'ignore-walk'

enum Status {
  Success = "success",
  Failure = "failure"
}

type CheckResult = {message: string, status: Status}

const defaultResult: CheckResult = {message: "No plugin found", status: Status.Failure};

function validateAction(action: string) {
  if (action !== 'checkRepo' && action !== 'checkFiles'){
    throw new Error(`Invalid action: ${action}`);
  }

  return action;
}

async function run(action: string) {
  process.chdir(WORKING_DIR);

  const repo = new Repo();
  
  const client = await createClient({
    appId: APP_ID,
    token: TOKEN,
    useWasi: true,
    runInWorker: true,
    allowedPaths: {
      ".": "."
    },
    functions: repo.getFunctions()
  });

  const f = client.extensionPoints["xtp-ci"][action];

  if (action === 'checkRepo'){
    await call(f, repo);
  } else if (action === 'checkFiles'){
    const files = await walk({path: "."});

    for(var file of files){
      console.log(`Checking ${file}`);
      await call(f, repo, file)
    }

  }
}

async function call(f: any, repo: Repo, file?: string) {
  let info: object;
  if (file !== undefined){
    info = repo.info();
  } else {
    info = repo.infoWithFile(file);
  }

  try {
    const res = await f(GUEST_KEY, JSON.stringify(info), {default: defaultResult});
    if (res.status === Status.Failure){
      console.error(res.message);
      process.exit(1);
    }

    if (res.message !== ""){
      console.log(res.message);
    }

  } catch(e) {
    console.error(e);
  }

}

const action = validateAction(process.argv[2] || 'checkRepo');
run(action)
