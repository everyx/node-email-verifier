# `@everyx/email-verifier`

Go 邮件验证库 [email-verifier](https://github.com/AfterShip/email-verifier) 的基于 [node-ffi-rs](https://github.com/zhangyuang/node-ffi-rs) 的 node 绑定库。

目前仅支持 Linux 系统，仅导出了 `suggestDomain` 和 `verify` 两个方法，并且未开启 SMTP 验证。

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
