import process from 'process'
import { spawnSync } from 'child_process'

import { CurrentPlugin } from '@extism/extism'; 

export enum Platform {
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

function gitSha(platform: Platform): string {
  switch (platform){
    case Platform.Github:
      return process.env.GITHUB_SHA!;
    case Platform.Gitlab:
      return process.env.CI_COMMIT_SHA!;
    case Platform.Local:
      return new TextDecoder().decode(spawnSync("git", ["rev-parse", "HEAD"]).stdout).trim();
  }
}

function gitBranch(platform: Platform): string {
  switch (platform){
    case Platform.Github:
      return process.env.GITHUB_REF_NAME;
    case Platform.Gitlab:
      return process.env.CI_COMMIT_REF_NAME;
    case Platform.Local:
      return new TextDecoder().decode(spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"]).stdout).trim();
  }
}

function getCommonFunctions(): object {
  return {
    "extism:host/user": {
      "shell": function(plugin: CurrentPlugin, args: bigint): bigint {
        const a = plugin.read(args)!.json();
        const res = spawnSync(a.command[0], a.command.slice(1), {cwd: a["dir"]});
        const decoder = new TextDecoder();
        const j = {stdout: decoder.decode(res.stdout), stderr: decoder.decode(res.stderr), exitCode: res.status || -1};
        return plugin.store(JSON.stringify(j));  
      },
    }
  };
}

export class Repo {
  platform: Platform
  sha: string
  branch: string
  args: string[]

  constructor() {
    this.platform = getPlatform();
    this.sha = gitSha(this.platform);
    this.branch = gitBranch(this.platform);
    this.args = process.argv.slice(3);
  }

  
  getFunctions(): object {
    let funcs = getCommonFunctions();
    // switch (platform) {
    // case Platform.Local:
    // case Platform.Github:
    // case Platform.Gitlab:
    // }
    return funcs;
  }

  info(): object {
    return {sha: this.sha, branch: this.branch, args: this.args};
  }

  infoWithFile(filename: string): object {
    const x = this.info();
    x['inputFile'] = filename;
    return x;
  }
}


