"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const xtp_1 = __importDefault(require("@dylibso/xtp"));
const env_1 = require("./env");
const repo_1 = require("./repo");
const ignore_walk_1 = __importDefault(require("ignore-walk"));
var Status;
(function (Status) {
    Status["Success"] = "Success";
    Status["Fail"] = "Fail";
})(Status || (Status = {}));
const defaultResult = { message: "No plugin found", status: Status.Fail };
function validateAction(action) {
    if (action !== 'checkRepo' && action !== 'scanFiles') {
        throw new Error(`Invalid action: ${action}`);
    }
    return action;
}
async function run(action) {
    process_1.default.chdir(env_1.WORKING_DIR);
    const repo = new repo_1.Repo();
    const client = await (0, xtp_1.default)({
        appId: env_1.APP_ID,
        token: env_1.TOKEN,
        useWasi: true,
        runInWorker: true,
        allowedPaths: {
            ".": "."
        },
        functions: repo.getFunctions()
    });
    const f = client.extensionPoints["xtp-ci"][action];
    if (action === 'checkRepo') {
        await call(f, repo);
    }
    else if (action === 'scanFiles') {
        const files = await (0, ignore_walk_1.default)({ ignoreFiles: [".gitignore"] });
        for (var file of files) {
            console.info(`Checking ${file}`);
            await call(f, repo, file);
        }
    }
}
async function call(f, repo, file) {
    let info;
    if (file === undefined) {
        info = repo.info();
    }
    else {
        info = repo.infoWithFile(file);
    }
    try {
        const res = await f(env_1.GUEST_KEY, JSON.stringify(info), { default: defaultResult });
        if (res.status === Status.Fail) {
            console.error(res.message);
            process_1.default.exit(1);
        }
        if (res.message !== "") {
            console.log(res.message);
        }
    }
    catch (e) {
        console.error(e);
        process_1.default.exit(2);
    }
}
const action = validateAction(process_1.default.argv[2] || 'checkRepo');
run(action);
