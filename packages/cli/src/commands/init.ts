import { Command } from 'commander'
import prompts from 'prompts'
import fsExtra from 'fs-extra'
const { copy, readJSON, writeJSON } = fsExtra
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import ora from 'ora'
import chalk from 'chalk'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATE_DIR = resolve(__dirname, '../../../templates/base')

interface Answers {
  ai: 'anthropic' | 'openai' | 'both'
  auth: 'supabase' | 'nextauth'
  stripe: boolean
  resend: boolean
  rag: boolean
}

export const initCommand = new Command('init')
  .argument('<project-name>', 'name for the new project')
  .description('Scaffold a new Next.js + Supabase + Claude AI project')
  .action(async (projectName: string) => {
    console.log(chalk.bold(`\nCreating ${chalk.cyan(projectName)}...\n`))

    const answers = await prompts(
      [
        {
          type: 'select',
          name: 'ai',
          message: 'AI provider?',
          choices: [
            { title: 'Anthropic (Claude)', value: 'anthropic' },
            { title: 'OpenAI (GPT)', value: 'openai' },
            { title: 'Both', value: 'both' },
          ],
        },
        {
          type: 'select',
          name: 'auth',
          message: 'Auth provider?',
          choices: [
            { title: 'Supabase Auth', value: 'supabase' },
            { title: 'NextAuth.js', value: 'nextauth' },
          ],
        },
        { type: 'confirm', name: 'stripe', message: 'Add Stripe payments?', initial: false },
        { type: 'confirm', name: 'resend', message: 'Add Resend email?', initial: false },
        { type: 'confirm', name: 'rag', message: 'Add RAG / vector search (pgvector)?', initial: false },
      ],
      { onCancel: () => process.exit(1) },
    )

    const target = resolve(process.cwd(), projectName)
    const spinner = ora('Copying template...').start()

    try {
      await copy(TEMPLATE_DIR, target, {
        filter: (src) => !src.includes('node_modules') && !src.includes('.next'),
      })

      spinner.text = 'Configuring project...'

      const pkg = await readJSON(resolve(target, 'package.json')) as Record<string, unknown> & {
        name: string
        dependencies: Record<string, string>
        devDependencies: Record<string, string>
      }
      pkg.name = projectName

      const { ai, auth, stripe, resend, rag } = answers as Answers

      if (ai === 'anthropic' || ai === 'both') {
        pkg.dependencies['@anthropic-ai/sdk'] = '^0.91.0'
      }
      if (ai === 'openai' || ai === 'both') {
        pkg.dependencies['openai'] = '^4.91.0'
      }
      if (auth === 'supabase') {
        pkg.dependencies['@supabase/ssr'] = '^0.10.0'
        pkg.dependencies['@supabase/supabase-js'] = '^2.49.0'
      }
      if (auth === 'nextauth') {
        pkg.dependencies['next-auth'] = '^4.24.0'
      }
      if (stripe) {
        pkg.dependencies['stripe'] = '^16.12.0'
        pkg.dependencies['@stripe/stripe-js'] = '^4.10.0'
      }
      if (resend) {
        pkg.dependencies['resend'] = '^3.5.0'
      }
      if (rag) {
        if (!pkg.dependencies['@supabase/ssr']) {
          pkg.dependencies['@supabase/ssr'] = '^0.10.0'
          pkg.dependencies['@supabase/supabase-js'] = '^2.49.0'
        }
      }

      await writeJSON(resolve(target, 'package.json'), pkg, { spaces: 2 })

      spinner.text = 'Installing dependencies...'
      execSync('pnpm install', { cwd: target, stdio: 'pipe' })

      spinner.text = 'Initializing git repository...'
      execSync(
        'git init && git add . && git commit -m "init: scaffold from claude-mvp-toolkit"',
        { cwd: target, stdio: 'pipe', shell: true },
      )

      spinner.succeed(chalk.green(`Project ${chalk.bold(projectName)} created successfully!`))

      console.log(chalk.dim('\nNext steps:'))
      console.log(`  ${chalk.cyan('cd')} ${projectName}`)
      console.log(`  ${chalk.cyan('cp')} .env.example .env.local`)
      console.log(`  ${chalk.cyan('pnpm')} dev\n`)
    } catch (err) {
      spinner.fail('Something went wrong')
      throw err
    }
  })
