mod pdk;

use extism_pdk::*;
use pdk::*;

pub fn ok() -> Result<CheckResult, Error> {
    Ok(CheckResult {
        message: "ok".to_string(),
        status: Status::Success,
    })
}

// Check one file at a time
pub(crate) fn check_files(input: RepoInfo) -> Result<CheckResult, Error> {
    ok()
}

// Check an entire repo
pub(crate) fn check_repo(_input: RepoInfo) -> Result<CheckResult, Error> {
    ok()
}
