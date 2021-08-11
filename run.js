const fse = require('fs-extra')
const inquirer = require('inquirer') // 交互式命令
const chalk = require('chalk').default // 彩色 log
const ora = require('ora') // loading
const download = require('download-git-repo') // github 仓库下载

// 我的 GitHub 仓库地址
const MyGitHub = 'https://github.com/JS-banana/'
// 错误处理
const catchErr = err => console.log(chalk.red(err))

// 平台
const Platform_Questions = [
  {
    name: 'platform',
    message: '请选择平台：PC 或 mobile ？',
    type: 'list',
    choices: ['pc', 'mobile'],
    default: 'pc',
  },
]

// 可使用的项目模板
const Templates = ['webpack-react-ts', 'vite-react-ts']

// 项目模板
const Templates_Questions = [
  {
    name: 'template',
    message: '请选择项目模板：',
    type: 'list',
    choices: Templates,
  },
]

// 项目信息
const Info_Questions = [
  {
    name: 'author',
    message: 'please enter a author：',
    type: 'input',
  },
  {
    name: 'description',
    message: 'please enter a description：',
    type: 'input',
  },
]

// 命令选择
const run = async name => {
  // const answers = {}

  // 选择平台
  const { platform } = await inquirer.prompt(Platform_Questions)

  // 容错处理
  if (platform === 'mobile') return catchErr('ERROR：目前尚无移动端模板，敬请期待！')

  // 请选择项目
  const { template } = await inquirer.prompt(Templates_Questions)

  // 项目信息
  const { author, description } = await inquirer.prompt(Info_Questions)
  const Info = { name, author, description }

  // loading
  const spinner = ora('downloading template...')

  // 下载路径
  const repo = `direct:${MyGitHub}/${template}.git`
  // 输出路径
  const dest = name

  // 下载 GitHub模板
  spinner.start()
  download(repo, dest, { clone: true }, err => {
    // err
    if (err) {
      spinner.fail()
      catchErr(`${err}`)
      process.exit(1)
    }
    // succeed
    spinner.succeed()

    // 修改模板信息
    const pkg = `${dest}/package.json`
    const content = fse.readJsonSync(pkg)
    const result = { ...content, ...Info }
    fse.outputJSONSync(pkg, result, { spaces: 2 })
  })
}

run('my-app')
