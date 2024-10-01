"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const child_process_1 = require("child_process");
require("dotenv/config");
const xtp_1 = __importDefault(require("@dylibso/xtp"));
const APP_ID = process_1.default.env.XTP_APP_ID;
const TOKEN = process_1.default.env.XTP_TOKEN;
const GUEST_KEY = process_1.default.env.XTP_GUEST_KEY || "me";
const WORKING_DIR = process_1.default.env.WORKING_DIR || ".";
var Platform;
(function (Platform) {
    Platform["Local"] = "local";
    Platform["Github"] = "github";
    Platform["Gitlab"] = "gitlab";
})(Platform || (Platform = {}));
function getPlatform() {
    if (!process_1.default.env.CI) {
        return Platform.Local;
    }
    if (process_1.default.env.GITLAB_CI !== undefined) {
        return Platform.Gitlab;
    }
    if (process_1.default.env.GITHUB_ACTIONS !== undefined) {
        return Platform.Github;
    }
    throw new Error("Unable to detect CI platform");
}
function getCommonFunctions() {
    return {
        "extism:host/user": {
            "clone": function (plugin, repo) {
                const repoUrl = plugin.read(repo).text();
                (0, child_process_1.spawnSync)("git", ["clone", repoUrl]);
            }
        }
    };
}
function getFunctionsForPlatform(platform) {
    let funcs = getCommonFunctions();
    // switch (platform) {
    // case Platform.Local:
    // case Platform.Github:
    // case Platform.Gitlab:
    // }
    return funcs;
}
function gitSha(platform) {
    switch (platform) {
        case Platform.Github:
            return process_1.default.env.GITHUB_SHA;
        case Platform.Gitlab:
            return process_1.default.env.CI_COMMIT_SHA;
        case Platform.Local:
            return new TextDecoder().decode((0, child_process_1.spawnSync)("git", ["rev-parse", "HEAD"]).stdout).trim();
    }
}
function gitBranch(platform) {
    switch (platform) {
        case Platform.Github:
            return process_1.default.env.GITHUB_REF_NAME;
        case Platform.Gitlab:
            return process_1.default.env.CI_COMMIT_REF_NAME;
        case Platform.Local:
            return new TextDecoder().decode((0, child_process_1.spawnSync)("git", ["rev-parse", "--abbrev-ref", "HEAD"]).stdout).trim();
    }
}
async function run() {
    process_1.default.chdir(WORKING_DIR);
    const platform = getPlatform();
    console.log(gitBranch(platform));
    const client = await (0, xtp_1.default)({
        appId: APP_ID,
        token: TOKEN,
        useWasi: true,
        config: {
            "GIT_SHA": gitSha(platform),
            "GIT_BRANCH": gitBranch(platform),
        },
        allowedPaths: {
            ".": "."
        },
        functions: getFunctionsForPlatform(platform)
    });
    console.log(await client.extensionPoints["xtp-ci"].checkRepo(GUEST_KEY, "test", { default: "" }));
}
run();
