# SHEIN 搜品 Excel 采集 SOP

## 数据源
- `gbRawData.results.bffProductsInfo.products[]`

## 采集流程
1. 通过 CDP 连接 Edge 浏览器，导航至 SHEIN 品类页
2. 滚动加载商品列表
3. 解析 JavaScript 变量提取商品信息
4. 自动翻页采集（需直接 page=N 跳转，滚动页面不更新数据）

## 商品字段
- 图片：`goods_img` 字段（加 `https:` 前缀）
- 上新时间：图片 URL 路径中 `/YYYY/MM/DD/` 解析
- 销量：`comment_num`（评论数近似）
- 排序：`sort=7`（Most Popular），禁用 sort=8
- 商品链接拼接：`{name}-p-{ID}.html`

## Excel 输出字段
序号、BS排名、类型、商品图、名称、链接、价格、销量、上新时间

## 防重复机制
- 维护 `collected_products.json` 商品库
- 每次搜索前过滤已收集 ID
- 按品类标记分类标签

## 注意事项
- 链接用 `name-p-ID.html` 格式，避免跳转首页
- 滚动页面不会更新 gbRawData，直接 page=N 翻页
- 多步任务数据立刻落盘 JSON，写独立 JS 脚本执行
