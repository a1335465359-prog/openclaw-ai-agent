# 浏览器自动化 (CDP) SOP

## 连接方式
- Edge 浏览器 + CDP 端口 18800
- profile: openclaw
- userDataDir: `%USERPROFILE%\.openclaw\browser\openclaw\user-data`

## 启动命令
```bash
msedge.exe --remote-debugging-port=18800 --user-data-dir="%USERPROFILE%\.openclaw\browser\openclaw\user-data"
```

## 操作流程
1. 检查浏览器状态: `openclaw browser status`
2. 打开页面: `openclaw browser open --url "xxx" --label "task"`
3. 获取快照: `snapshot` 获取交互元素 ref
4. 执行操作: `act type` / `act click` 使用最新 ref

## 小红书发布特别流程
1. 导航 `https://creator.xiaohongshu.com/publish/publish`
2. JS 点击 `.title` 为"上传图文"的 tab
3. snapshot → 找 button "上传图片" → click ref（关键！）
4. browser upload 传图片（不指定 selector）
5. 等 6-8 秒
6. snapshot 获取标题/正文 textbox ref
7. act type 填写标题和正文

## 常见问题
- 直接 upload（selector=input[type=file]）→ ok 但不进编辑态
- DOM querySelector 找编辑区 → picasso 渲染，不在 DOM
- CDP Input.dispatchMouseEvent → picasso 不响应
- 图片必须在 `%TEMP%\openclaw\uploads\`
