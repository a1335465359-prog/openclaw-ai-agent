/**
 * 小红书内容发布脚本
 * 通过 CDP 浏览器自动化发布小红书笔记
 * 每日消耗约 200 万 Token
 */

const CDP = require('chrome-remote-interface');

async function postToXiaohongshu(title, content, imagePaths) {
  const client = await CDP({ port: 18800 });
  const { Runtime, Page, DOM } = client;

  await Page.enable();
  await Runtime.enable();

  // 导航到小红书创作者平台
  await Page.navigate({ url: 'https://creator.xiaohongshu.com/publish/publish' });
  await new Promise(r => setTimeout(r, 5000));

  // 点击"上传图文"
  await Runtime.evaluate({
    expression: `(() => {
      const tabs = document.querySelectorAll('.title');
      for (const tab of tabs) {
        if (tab.textContent.includes('上传图文')) {
          tab.click();
          return 'clicked';
        }
      }
      return 'not found';
    })()`,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 2000));

  // 点击上传按钮
  await Runtime.evaluate({
    expression: `(() => {
      const btn = document.querySelector('button');
      if (btn && btn.textContent.includes('上传图片')) {
        btn.click();
        return 'clicked upload';
      }
      return 'upload button not found';
    })()`,
    returnByValue: true
  });

  // 等待上传完成
  await new Promise(r => setTimeout(r, 8000));

  // 填写标题和正文
  await Runtime.evaluate({
    expression: `(() => {
      const titleInput = document.querySelector('.title input, .title textarea');
      const contentInput = document.querySelector('.content textarea, .ql-editor');
      
      if (titleInput) {
        titleInput.value = '${title}';
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (contentInput) {
        contentInput.textContent = '${content}';
        contentInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return 'filled';
    })()`,
    returnByValue: true
  });

  // 点击发布
  await Runtime.evaluate({
    expression: `(() => {
      const publishBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('发布'));
      if (publishBtn) {
        publishBtn.click();
        return 'published';
      }
      return 'publish button not found';
    })()`,
    returnByValue: true
  });

  await client.close();
  return { success: true, title };
}

module.exports = { postToXiaohongshu };
