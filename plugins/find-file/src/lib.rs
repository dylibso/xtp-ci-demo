mod pdk;

use std::path::PathBuf;

use extism_pdk::*;
use pdk::*;

pub fn ok() -> Result<CheckResult, Error> {
    Ok(CheckResult {
        message: "ok".to_string(),
        status: Status::Success,
    })
}

pub fn err(path: impl Into<PathBuf>) -> Result<CheckResult, Error> {
    let path = path.into();
    Ok(CheckResult {
        message: format!("error: {} found", path.display()),
        status: Status::Fail,
    })
}

// Check one file at a time
pub(crate) fn scan_files(input: RepoInfo) -> Result<CheckResult, Error> {
    let args = match input.args {
        Some(a) => std::collections::HashSet::<String>::from_iter(a.into_iter()),
        None => return ok(),
    };

    if input
        .input_file
        .as_ref()
        .map(std::path::PathBuf::from)
        .is_some_and(|x| args.contains(x.file_name().unwrap().to_str().unwrap()))
    {
        return err(input.input_file.unwrap());
    }
    ok()
}

// Check an entire repo
pub(crate) fn check_repo(input: RepoInfo) -> Result<CheckResult, Error> {
    let args = match input.args {
        Some(a) => std::collections::HashSet::<String>::from_iter(a.into_iter()),
        None => return ok(),
    };

    for item in ignore::WalkBuilder::new(".").build() {
        let item = item?;
        if args.contains(item.file_name().to_str().unwrap()) {
            return err(item.file_name());
        }
    }
    ok()
}
