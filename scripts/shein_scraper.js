/**
 * SHEIN 数据采集脚本
 * 自动采集 SHEIN 商品数据并导出 Excel
 * 每日消耗约 500 万 Token
 */

const CDP = require('chrome-remote-interface');

async function scrapeShein(category, maxPages = 5) {
  const client = await CDP({ port: 18800 });
  const { Runtime, Page } = client;

  await Page.enable();
  await Runtime.enable();

  // 导航到 SHEIN
  await Page.navigate({ url: `https://us.shein.com/${category}.html` });
  await new Promise(r => setTimeout(r, 5000));

  const products = [];

  for (let page = 1; page <= maxPages; page++) {
    console.log(`Scraping page ${page}...`);

    // 解析 gbRawData
    const result = await Runtime.evaluate({
      expression: `(() => {
        if (typeof gbRawData !== 'undefined') {
          return JSON.stringify(gbRawData.results.bffProductsInfo.products.map(p => ({
            id: p.product_id,
            name: p.product_name,
            price: p.salePrice?.amount || p.retailPrice?.amount,
            image: p.goods_img,
            sales: p.comment_num,
            url: 'https://us.shein.com/' + p.product_name.toLowerCase().replace(/ /g, '-') + '-p-' + p.product_id + '.html'
          })));
        }
        return '[]';
      })()`,
      returnByValue: true
    });

    const pageProducts = JSON.parse(result.result.value);
    products.push(...pageProducts);
    console.log(`Found ${pageProducts.length} products on page ${page}`);

    // 翻页
    if (page < maxPages) {
      await Page.navigate({ url: `https://us.shein.com/${category}.html?page=${page + 1}` });
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  await client.close();
  return products;
}

module.exports = { scrapeShein };
