import type { FFIParams, FieldType, FieldTypeToType, ResultWithErrno } from 'ffi-rs'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { arch, platform } from 'node:os'
import { report } from 'node:process'
import { close, load, open } from 'ffi-rs'

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
    // @ts-expect-error 2339
    const { glibcVersionRuntime } = report.getReport().header
    return !glibcVersionRuntime
  }
}

const _arch = arch()
const _platform = platform()
const toolchain = isMusl() ? 'musl' : _arch === 'arm' ? 'gnueabihf' : 'gnu'
const libPath = createRequire(import.meta.url).resolve(`@everyx/email-verifier-${_platform}-${_arch}-${toolchain}`)
const library = 'libemailverifier'

export async function loadLib<
  T extends FieldType,
  U extends boolean | undefined = undefined,
>(
  params: Omit<FFIParams<T, U, true>, 'library' | 'runInNewThread' | 'freeResultMemory'>,
): Promise<ResultWithErrno<FieldTypeToType<T>, U>> {
  open({ library, path: libPath })

  const result = await load({
    library,
    runInNewThread: true,
    freeResultMemory: true,
    ...params,
  })

  close(library)

  return result
}
