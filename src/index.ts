import process from 'process'
import { spawnSync } from 'child_process'

import 'dotenv/config'
import createClient from '@dylibso/xtp'
import { CurrentPlugin } from '@extism/extism'; 

const APP_ID = process.env.XTP_APP_ID;
const TOKEN = process.env.XTP_TOKEN;
const GUEST_KEY = process.env.XTP_GUEST_KEY || "me";
const WORKING_DIR = process.env.WORKING_DIR || ".";

enum Platform {
  Local = "local",
  Github = "github",
  Gitlab = "gitlab"
}

function getPlatform(): Platform {
  if (!process.env.CI){
    return Platform.Local;
  }

  if (process.env.GITLAB_CI !== undefined){
    return Platform.Gitlab;
  }

  if (process.env.GITHUB_ACTIONS !== undefined){
    return Platform.Github;
  }

  throw new Error("Unable to detect CI platform"); 
}

function getCommonFunctions(): object {
  return {
    "extism:host/user": {
      "clone": function(plugin: CurrentPlugin, repo: bigint){
        const repoUrl = plugin.read(repo)!.text();
        spawnSync("git", ["clone", repoUrl]); 
      }
    }
  };
}

function getFunctionsForPlatform(platform: Platform): object {
  let funcs = getCommonFunctions();
  // switch (platform) {
  // case Platform.Local:
  // case Platform.Github:
  // case Platform.Gitlab:
  // }
  return funcs;
}

function gitSha(platform: Platform): string {
  switch (platform){
    case Platform.Github:
      return process.env.GITHUB_SHA!;
    case Platform.Gitlab:
      return process.env.CI_COMMIT_SHA!;
    case Platform.Local:
      return new TextDecoder().decode(spawnSync("git", ["rev-parse", "HEAD"]).stdout);
  }
}


async function run() {
  process.chdir(WORKING_DIR);
  
  const platform = getPlatform();

  console.log("PLATFORM", gitSha(platform));
  
  const client = await createClient({
    appId: APP_ID,
    token: TOKEN,
    useWasi: true,
    config: {
      "GIT_SHA": gitSha(platform),
      },
    allowedPaths: {
      ".": "."
    },
    functions: getFunctionsForPlatform(platform)
  });

  console.log(await client.extensionPoints["xtp-ci"].checkRepo(GUEST_KEY, "test", {default: ""}));
}

run()
