import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import * as os from 'node:os'
import { report } from 'node:process'
import { fileURLToPath } from 'node:url'
import { close, DataType, load, open } from 'ffi-rs'

function isMusl(): boolean {
  // For Node 10
  if (!report || typeof report.getReport !== 'function') {
    try {
      const lddPath = execSync('which ldd').toString().trim()
      return readFileSync(lddPath, 'utf8').includes('musl')
    }
    catch { return true }
  }
  else {
    // @ts-expect-error
    const { glibcVersionRuntime } = report.getReport().header
    return !glibcVersionRuntime
  }
}
const arch = os.arch()
const platform = os.platform()

const toolchain = isMusl() ? 'musl' : arch === 'arm' ? 'gnueabihf' : 'gnu'
const library = 'libemailverifier'
const libraryURL = import.meta.resolve(`@everyx/email-verifier-${platform}-${arch}-${toolchain}`)
const openLib = () => open({ library, path: fileURLToPath(libraryURL) })
const closeLib = () => close(library)

export async function verify(email: string): Promise<Record<string, any>> {
  openLib()
  const result = await load({
    library, // 动态库文件的路径
    funcName: 'Verify', // 要调用的函数名
    retType: DataType.String, // 返回值类型
    paramsType: [DataType.String], // 参数类型
    paramsValue: [email], // 实际参数值
    freeResultMemory: true, // 是否需要自动释放返回值的内存,默认为false
    runInNewThread: true,
  })
  closeLib()

  const { data, error } = JSON.parse(result)
  if (error)
    throw new Error(error)
  return data
}

export async function suggestDomain(domain: string): Promise<string> {
  openLib()
  const result = await load({
    library, // 动态库文件的路径
    funcName: 'SuggestDomain', // 要调用的函数名
    retType: DataType.String, // 返回值类型
    paramsType: [DataType.String], // 参数类型
    paramsValue: [domain], // 实际参数值
    freeResultMemory: true, // 是否需要自动释放返回值的内存,默认为false
    runInNewThread: true,
  })
  closeLib()
  return result
}
