// THIS FILE WAS GENERATED BY `xtp-rust-bindgen`. DO NOT EDIT.

#![allow(non_snake_case)]
use extism_pdk::*;
use serde::{Deserialize, Serialize};

fn return_error(e: Error) -> i32 {
    let err = format!("{:?}", e);
    let mem = extism_pdk::Memory::from_bytes(&err).unwrap();
    unsafe {
        extism_pdk::extism::error_set(mem.offset());
    }
    -1
}

macro_rules! try_input {
    () => {{
        let x = input();
        match x {
            Ok(x) => x,
            Err(e) => return return_error(e),
        }
    }};
}

macro_rules! try_input_json {
    () => {{
        let x = input();
        match x {
            Ok(Json(x)) => x,
            Err(e) => return return_error(e),
        }
    }};
}

use base64_serde::base64_serde_type;

base64_serde_type!(Base64Standard, base64::engine::general_purpose::STANDARD);

#[no_mangle]
pub extern "C" fn checkFiles() -> i32 {
    let ret = crate::check_files(try_input_json!()).and_then(|x| output(Json(x)));

    match ret {
        Ok(()) => 0,
        Err(e) => return_error(e),
    }
}

#[no_mangle]
pub extern "C" fn checkRepo() -> i32 {
    let ret = crate::check_repo(try_input_json!()).and_then(|x| output(Json(x)));

    match ret {
        Ok(()) => 0,
        Err(e) => return_error(e),
    }
}

#[derive(Serialize, Deserialize, FromBytes, ToBytes)]
#[encoding(Json)]
pub struct CheckResult {
    // Result message
    #[serde(rename = "message")]
    pub message: String,
    // Check status
    #[serde(rename = "status")]
    pub status: Status,
}

#[derive(Serialize, Deserialize, FromBytes, ToBytes)]
#[encoding(Json)]
pub struct RepoInfo {
    // Git branch name
    #[serde(rename = "branch")]
    pub branch: String,
    // Path to file being checked
    #[serde(rename = "inputFile")]
    #[serde(default)]
    pub input_file: Option<String>,
    // Git SHA
    #[serde(rename = "sha")]
    pub sha: String,
}

#[derive(Serialize, Deserialize, FromBytes, ToBytes)]
#[encoding(Json)]
pub enum Status {
    #[serde(rename = "Success")]
    Success,
    #[serde(rename = "Fail")]
    Fail,
}

mod raw_imports {
    use super::*;
    #[host_fn]
    extern "ExtismHost" {

        pub(crate) fn clone(input: String) -> Json<CheckResult>;

        pub(crate) fn fail(input: String) -> Json<CheckResult>;

    }
}

// clone Clone a Git repo
// It takes input of String (The URL of the repo to clone)
// And it returns an output CheckResult (Result of running a check)
#[allow(unused)]
pub(crate) fn clone(input: String) -> Result<CheckResult, extism_pdk::Error> {
    let res = unsafe { raw_imports::clone(input)? };

    let Json(res) = res;

    Ok(res)
}

// fail Fail CI run
// It takes input of String (A message to print before exiting)
// And it returns an output CheckResult (Result of running a check)
#[allow(unused)]
pub(crate) fn fail(input: String) -> Result<CheckResult, extism_pdk::Error> {
    let res = unsafe { raw_imports::fail(input)? };

    let Json(res) = res;

    Ok(res)
}