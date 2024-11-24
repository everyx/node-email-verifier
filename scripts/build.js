import { execSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { platform } from 'node:os'
import { dirname, join } from 'node:path'
import { env, exit } from 'node:process'
import { fileURLToPath } from 'node:url'

const TARGETS = {
  os: {
    darwin: {
      zig: 'macos',
      go: 'darwin',
    },
    linux: {
      zig: 'linux',
      go: 'linux',
    },
    win32: {
      zig: 'windows',
      go: 'windows',
    },
  },
  arch: {
    arm64: {
      zig: 'aarch64',
      go: 'arm64',
    },
    x64: {
      zig: 'x86_64',
      go: 'amd64',
    },
    arm: {
      zig: 'arm',
      go: 'arm',
    },
    ia32: {
      zig: 'x86',
      go: '386',
    },
  },
}

const currentFilePath = fileURLToPath(import.meta.url)
const packagesDir = join(dirname(currentFilePath), '../packages')
const libDir = join(packagesDir, '../lib')
const hostOS = platform()

function build(options) {
  const { os, arch, toolchain, distDir } = options

  if (hostOS !== os)
    return

  const zigTarget = `${TARGETS.arch[arch].zig}-${TARGETS.os[os].zig}${toolchain ? `-${toolchain}` : ''}`

  console.log(`-> Building ${zigTarget}`)

  const { main: distFile } = JSON.parse(readFileSync(join(distDir, 'package.json')))
  return execSync(
    `go build -trimpath -ldflags="-s -w" -buildmode=c-shared -o ${distDir}/${distFile} libemailverifier.go`,
    {
      stdio: 'inherit',
      cwd: libDir,
      env: {
        ...env,
        CGO_ENABLED: '1',
        GOOS: TARGETS.os[os].go,
        GOARCH: TARGETS.arch[arch].go,
        CC: `zig cc -target ${zigTarget}`,
        CXX: `zig c++ -target ${zigTarget}`,
      },
    },
  )
}

const libPackagePrefix = 'email-verifier-'
const options = readdirSync(packagesDir)
  .filter(file => file.startsWith(libPackagePrefix))
  .map((file) => {
    const target = file.replace(libPackagePrefix, '')
    const [os, arch, toolchain] = target.split('-')
    return { os, arch, toolchain, distDir: join(packagesDir, file) }
  })

for (const option of options) {
  try {
    build(option)
  }
  catch {
    exit(1)
  }
}
