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
    if input
        .input_file
        .map(std::path::PathBuf::from)
        .is_some_and(|x| x.file_name().unwrap() == "bad.txt")
    {
        return Ok(CheckResult {
            message: "bad.txt found".to_string(),
            status: Status::Fail,
        });
    }
    ok()
}

// Check an entire repo
pub(crate) fn check_repo(input: RepoInfo) -> Result<CheckResult, Error> {
    ok()
}
