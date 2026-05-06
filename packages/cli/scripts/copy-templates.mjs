import pkg from 'fs-extra'
const { copySync } = pkg
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
copySync(
  resolve(__dirname, '../../templates/base'),
  resolve(__dirname, '../templates/base'),
  { filter: (p) => !p.includes('node_modules') && !p.includes('.next') },
)
console.log('Templates copied to packages/cli/templates/base')
