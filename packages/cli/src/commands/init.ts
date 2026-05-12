import { Command } from 'commander'
import prompts from 'prompts'
import fsExtra from 'fs-extra'
const { copy, readJSON, writeJSON, remove, copyFile } = fsExtra
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'
import ora from 'ora'
import chalk from 'chalk'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATE_DIR = resolve(__dirname, '../templates/base')

type AIProvider = 'anthropic' | 'openai' | 'both'

interface Answers {
  ai: AIProvider
  auth: 'supabase' | 'nextauth'
  stripe: boolean
  resend: boolean
  rag: boolean
}

const DEFAULT_ANSWERS: Answers = {
  ai: 'both',
  auth: 'supabase',
  stripe: false,
  resend: false,
  rag: false,
}

function writeEnvExample(projectDir: string, provider: AIProvider): void {
  const path = join(projectDir, '.env.example')
  const lines: string[] = []

  lines.push('# ─────────────────────────────')
  lines.push('# AI Provider Configuration')
  lines.push('# ─────────────────────────────')
  lines.push('')

  if (provider === 'both') {
    lines.push('# Choose your provider: "anthropic" or "openai"')
    lines.push('AI_PROVIDER=anthropic')
  } else {
    lines.push(`AI_PROVIDER=${provider}`)
  }
  lines.push('')

  if (provider === 'anthropic' || provider === 'both') {
    lines.push('AI_MODEL_CHAT=claude-sonnet-4-6')
    lines.push('AI_MODEL_EMBED=voyage-3')
  } else {
    lines.push('AI_MODEL_CHAT=gpt-4o-mini')
    lines.push('AI_MODEL_EMBED=text-embedding-3-small')
  }
  lines.push('')

  lines.push('# ─────────────────────────────')
  lines.push('# API Keys')
  lines.push('# ─────────────────────────────')
  lines.push('')

  if (provider === 'anthropic' || provider === 'both') {
    lines.push('ANTHROPIC_API_KEY=')
    lines.push('VOYAGE_API_KEY=')
  }
  if (provider === 'openai' || provider === 'both') {
    lines.push('OPENAI_API_KEY=')
  }
  lines.push('')

  lines.push('# ─────────────────────────────')
  lines.push('# Supabase')
  lines.push('# ─────────────────────────────')
  lines.push('NEXT_PUBLIC_SUPABASE_URL=')
  lines.push('NEXT_PUBLIC_SUPABASE_ANON_KEY=')
  lines.push('SUPABASE_SERVICE_ROLE_KEY=')
  lines.push('')

  writeFileSync(path, lines.join('\n'))
}

async function applyProviderVariant(projectDir: string, provider: AIProvider): Promise<void> {
  const variantSrc = join(TEMPLATE_DIR, '_variants', `ai-index.${provider}.ts`)
  const variantDest = join(projectDir, 'src/lib/ai/index.ts')
  await copyFile(variantSrc, variantDest)

  if (provider === 'anthropic') {
    await remove(join(projectDir, 'src/lib/ai/providers/openai.ts'))
  } else if (provider === 'openai') {
    await remove(join(projectDir, 'src/lib/ai/providers/claude.ts'))
  }
}

export const initCommand = new Command('init')
  .argument('<project-name>', 'name for the new project')
  .description('Scaffold a new Next.js + Supabase project')
  .option('--yes', 'Use default options, skip prompts (Both providers + Supabase, no extras)')
  .option('--ai <provider>', 'AI provider: anthropic | openai | both (skips AI prompt)')
  .action(
    async (
      projectName: string,
      options: { yes?: boolean; ai?: AIProvider },
    ) => {
      console.log(chalk.bold(`\nCreating ${chalk.cyan(projectName)}...\n`))

      const aiFromFlag = options.ai
      if (aiFromFlag && !['anthropic', 'openai', 'both'].includes(aiFromFlag)) {
        console.log(chalk.red(`Invalid --ai value: "${aiFromFlag}". Use anthropic, openai, or both.`))
        process.exit(1)
      }

      const answers: Answers = options.yes
        ? { ...DEFAULT_ANSWERS, ...(aiFromFlag ? { ai: aiFromFlag } : {}) }
        : await prompts(
            [
              ...(aiFromFlag
                ? []
                : ([
                    {
                      type: 'select',
                      name: 'ai',
                      message: 'AI provider?',
                      choices: [
                        {
                          title: 'Both (recommended)',
                          description: 'Anthropic + OpenAI, switchable via .env',
                          value: 'both',
                        },
                        {
                          title: 'Anthropic only',
                          description: 'Claude + Voyage for embeddings',
                          value: 'anthropic',
                        },
                        {
                          title: 'OpenAI only',
                          description: 'GPT + OpenAI embeddings',
                          value: 'openai',
                        },
                      ],
                      initial: 0,
                    },
                  ] as prompts.PromptObject[])),
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
          ).then((partial) => ({ ...DEFAULT_ANSWERS, ...partial, ...(aiFromFlag ? { ai: aiFromFlag } : {}) }))

      const target = resolve(process.cwd(), projectName)

      const exists = await fsExtra.pathExists(target)
      if (exists) {
        const { overwrite } = await prompts({
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow(`Directory "${projectName}" already exists. Overwrite?`),
          initial: false,
        })
        if (!overwrite) {
          console.log(chalk.red('Aborted.'))
          process.exit(1)
        }
        await fsExtra.remove(target)
      }

      const spinner = ora('Copying template...').start()

      try {
        await copy(TEMPLATE_DIR, target, {
          filter: (src) => {
            const rel = src.slice(TEMPLATE_DIR.length)
            return (
              !rel.includes('node_modules') &&
              !rel.includes('.next') &&
              !rel.includes('_variants') &&
              !rel.endsWith('pnpm-lock.yaml') &&
              !rel.endsWith('tsconfig.tsbuildinfo')
            )
          },
        })

        spinner.text = 'Configuring project...'

        const pkg = (await readJSON(resolve(target, 'package.json'))) as Record<string, unknown> & {
          name: string
          dependencies: Record<string, string>
          devDependencies: Record<string, string>
        }
        pkg.name = projectName

        const { ai, auth, stripe, resend, rag } = answers

        delete pkg.dependencies['@anthropic-ai/sdk']
        delete pkg.dependencies['voyageai']
        delete pkg.dependencies['openai']

        if (ai === 'anthropic' || ai === 'both') {
          pkg.dependencies['@anthropic-ai/sdk'] = '^0.95.0'
          pkg.dependencies['voyageai'] = '^0.0.4'
        }
        if (ai === 'openai' || ai === 'both') {
          pkg.dependencies['openai'] = '^6.0.0'
        }

        if (auth === 'supabase' || rag) {
          pkg.dependencies['@supabase/ssr'] = '^0.5.2'
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

        await writeJSON(resolve(target, 'package.json'), pkg, { spaces: 2 })

        await applyProviderVariant(target, ai)
        writeEnvExample(target, ai)

        spinner.text = 'Installing dependencies...'
        try {
          execSync('pnpm install', { cwd: target, stdio: 'pipe' })
        } catch {
          spinner.warn(chalk.yellow('pnpm not found — skipping install. Run: npm install -g pnpm'))
          spinner.start('Finishing up...')
        }

        spinner.text = 'Initializing git repository...'
        try {
          execSync(
            'git init && git add . && git commit -m "init: scaffold from claude-mvp-toolkit"',
            { cwd: target, stdio: 'pipe', shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh' },
          )
        } catch {
          spinner.warn(chalk.yellow('git not found — skipping git init'))
          spinner.start('Finishing up...')
        }

        spinner.succeed(chalk.green('Project ready!'))
        console.log(chalk.bold(`\n  cd ${projectName} && pnpm dev\n`))
      } catch (err) {
        spinner.fail(chalk.red('Something went wrong'))
        throw err
      }
    },
  )
