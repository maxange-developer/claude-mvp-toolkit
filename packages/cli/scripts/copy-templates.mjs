import pkg from 'fs-extra'
const { copySync, removeSync } = pkg
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dest = resolve(__dirname, '../templates/base')

// Clean target first to prevent stale files (e.g. deleted in source but
// still present in previously-copied bundle) from leaking into published CLI.
removeSync(dest)

copySync(
  resolve(__dirname, '../../templates/base'),
  dest,
  {
    filter: (p) =>
      !p.includes('node_modules') &&
      !p.includes('.next') &&
      !p.endsWith('pnpm-lock.yaml') &&
      !p.endsWith('tsconfig.tsbuildinfo'),
  },
)
console.log('Templates copied to packages/cli/templates/base')
