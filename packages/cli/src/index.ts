import { Command } from 'commander'
import { createRequire } from 'module'
import { initCommand } from './commands/init.js'

const require = createRequire(import.meta.url)
const { version } = require('../package.json') as { version: string }

const program = new Command()
  .name('angel1-mvp-toolkit')
  .description('Scaffold production-ready Next.js + Supabase apps with multi-provider AI (Claude, OpenAI, or both)')
  .version(version)

program.addCommand(initCommand)
program.parse()
