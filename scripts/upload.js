/**
 * 微信小程序自动上传脚本（基于 miniprogram-ci）
 * 在 GitHub Actions 中运行：将小程序代码包上传到微信平台体验版
 *
 * 环境变量：
 *   WX_APPID             小程序 AppID
 *   WX_PRIVATE_KEY_PATH  上传密钥文件路径（.key）
 *   VERSION              上传版本号（默认取 CI 运行号）
 *   DESC                 上传备注
 */
const ci = require('miniprogram-ci');
const path = require('path');

const appid = process.env.WX_APPID;
const privateKeyPath = process.env.WX_PRIVATE_KEY_PATH;
const projectPath = path.resolve(__dirname, '..');

if (!appid || !privateKeyPath) {
  console.error('缺少环境变量 WX_APPID 或 WX_PRIVATE_KEY_PATH');
  process.exit(1);
}

const project = new ci.Project({
  appid,
  type: 'miniProgram',
  projectPath,
  privateKeyPath,
  ignores: [
    'node_modules/**',
    'scripts/**',
    'deploy/**',
    'web/**',
    '.github/**',
    'preview.html',
    'README.md',
    '部署指南.md'
  ]
});

(async () => {
  const version = process.env.VERSION || `1.0.${process.env.GITHUB_RUN_NUMBER || Date.now()}`;
  const desc = process.env.DESC || 'auto upload by CI';

  console.log(`开始上传：appid=${appid} version=${version} desc=${desc}`);

  const result = await ci.upload({
    project,
    version,
    desc,
    setting: {
      es6: true,
      minify: true,
      autoPrefixWXSS: true,
      minifyWXSS: true,
      minifyWXML: true
    }
  });

  console.log('上传成功：', JSON.stringify(result));
})().catch((err) => {
  console.error('上传失败：', err);
  process.exit(1);
});
