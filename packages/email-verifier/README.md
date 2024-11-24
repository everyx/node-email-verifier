# `@everyx/email-verifier`

A Node.js library for email verification without sending any emails.

It's based on the Go [AfterShip/email-verifier](https://github.com/AfterShip/email-verifier)
library and use [node-ffi-rs](https://github.com/zhangyuang/node-ffi-rs) for the FFI call.

Currently, it only supports Linux systems and has exported two methods:
`suggestDomain` and `verify`, with SMTP verification not enabled.

More information, checkout [AfterShip/email-verifier](https://github.com/AfterShip/email-verifier).

## Install

```console
$ pnpm install @everyx/email-verifier
```

## Usage

```ts
import { suggestDomain, verify } from '@everyx/email-verifier'

const data = await verify('name@example.com')
// {
//   email: 'name@example.com',
//   reachable: 'unknown',
//   syntax: { username: 'name', domain: 'example.com', valid: true },
//   smtp: null,
//   gravatar: null,
//   suggestion: '',
//   disposable: false,
//   role_account: false,
//   free: true,
//   has_mx_records: true
// }

const domain = await suggestDomain('gmai.com')
// gmail.com
```
