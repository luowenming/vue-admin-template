const puppeteer = require('puppeteer')
const path = require('path')

// 有时候操作需要暂停下
const sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })

const login = async({ username, pwd }) => {
  const browser = await puppeteer.launch({
    slowMo: 100, // 放慢速度
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: false // 忽略 https 报错
  })
  const page = await browser.newPage()
  await page.goto('http://localhost:9527/#/login')

  // 先截图看下非登录页面
  // await page.screenshot({
  //   path: path.resolve(__dirname, 'notLogin.png'),
  // });

  // 找到右上角登录按钮，点击
  // const btnLogin = await page.$('.login-button');
  // await btnLogin.click();

  // 找到登录弹框的其他登录方式，点击
  // const btnOtherWay = await page.$('.clickable');
  // await btnOtherWay.click();
  // sleep(1000);

  // 输入账号
  const inputUsername = await page.$('.username')
  inputUsername.focus()
  for (let i = 0; i < username.length; i++) {
    await inputUsername.type(username[i])
  }

  // 输入密码
  const inputPwd = await page.$('.password')
  inputPwd.focus()
  for (let i = 0; i < pwd.length; i++) {
    await inputPwd.type(pwd[i])
  }

  // 提交表单
  const btnConfirm = await page.$('.submit-btn')
  // 等待页面跳转完成，一般点击某个按钮需要跳转时，都需要等待 page.waitForNavigation() 执行完毕才表示跳转成功
  await Promise.all([btnConfirm.click(), page.waitForNavigation()])

  await sleep(3000)
  // 截图
  await page.screenshot({
    path: path.resolve(__dirname, 'login.png')
  })
  console.log('登录成功~')
  await page.close()
  await browser.close()
}

login({ username: 'admin', pwd: '111111' })
