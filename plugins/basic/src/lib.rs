mod pdk;

use extism_pdk::*;
use pdk::*;

pub fn ok() -> Result<CheckResult, Error> {
    Ok(CheckResult {
        message: "ok".to_string(),
        status: Status::Success,
    })
}

pub fn err() -> Result<CheckResult, Error> {
    Ok(CheckResult {
        message: "bad.txt found".to_string(),
        status: Status::Fail,
    })
}

// Check one file at a time
pub(crate) fn scan_files(input: RepoInfo) -> Result<CheckResult, Error> {
    if input
        .input_file
        .map(std::path::PathBuf::from)
        .is_some_and(|x| x.file_name().unwrap() == "bad.txt")
    {
        return err();
    }
    ok()
}

// Check an entire repo
pub(crate) fn check_repo(_input: RepoInfo) -> Result<CheckResult, Error> {
    for item in ignore::WalkBuilder::new(".").build() {
        let item = item?;
        if item.file_name() == "bad.txt" {
            return err();
        }
    }
    ok()
}
