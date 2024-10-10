# xtp-ci

A CI workflow using [XTP](https://www.getxtp.com/) and [Extism](https://github.com/extism/extism)

## Github

To use xtp-ci from Github actions, add the following to your workflow:

```
- uses: dylibso/xtp-ci@main
  with:
    action: checkRepo
    token: ${{ secrets.XTP_TOKEN }}
    appId: ${{ secrets.XTP_APP_ID }}
    guestKey: myGuestKey
    binding: my-binding-name
```


## Gitlab

To use xtp-ci from Gitlab CI, add the following to your configuration file:

```
include:
  - component: $CI_SERVER_FQDN/zshipko/xtp-ci@main
    inputs:
      token: $XTP_TOKEN
      appId: $XTP_APP_ID
      guestKey: myGuestKey
      binding: my-binding-name
```

(in this example $XTP_TOKEN and $XTP_APP_ID are Gitlab CI variables)

## Local

Create a `.env` file with the following environment variables:

```
XTP_TOKEN=""
XTP_GUEST_KEY=""
XTP_APP_ID=""
XTP_BINDING_NAME=""
```

Then you can run:

```
node dist/index.js {scanFiles|checkRepo}
```
