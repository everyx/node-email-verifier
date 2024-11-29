import { DataType } from 'ffi-rs'
import { loadLib } from './utils.js'

interface VerifyResult {
  data: {
    email: string
    reachable: 'unknown' | 'yes' | 'no'
    syntax: {
      username: string
      domain: string
      valid: boolean
    }
    smtp: null | {
      host_exists: boolean
      full_inbox: boolean
      catch_all: boolean
      deliverable: boolean
      disabled: boolean
    }
    gravatar: null | string
    suggestion: string
    disposable: boolean
    role_account: boolean
    free: boolean
    has_mx_records: boolean
  }
  error: string
}

export async function verify(email: string): Promise<VerifyResult> {
  const result = await loadLib({
    funcName: 'Verify',
    retType: DataType.String,
    paramsType: [DataType.String],
    paramsValue: [email],
  })

  return JSON.parse(result)
}

export async function suggestDomain(domain: string): Promise<string> {
  const result = await loadLib({
    funcName: 'SuggestDomain', // 要调用的函数名
    retType: DataType.String, // 返回值类型
    paramsType: [DataType.String], // 参数类型
    paramsValue: [domain], // 实际参数值
  })
  return result
}
