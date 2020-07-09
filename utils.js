const request = require('request')
const superagent = require('superagent')
const cheerio = require('cheerio')
const phantom = require('phantom')

function delay(second) {
  return new Promise((resolve) => {
      setTimeout(resolve, second * 1000);
  });
}

/**
 * 获取页面内容
 * @param {String} url 要爬取的页面地址
 * @return {Object} 类似 jQuery 对象
 */
function getPage(url) {
  return new Promise(function(resolve, reject) {
    superagent.get(url).end((err, res) => {
      if (err) {
        reject(err)
        throw Error(err);
      }
      let $content = cheerio.load(res.text)
      resolve($content)
    })
  })
}

/**
 * 获取页面内容，因有些页面需要滚动加载数据，所以需延迟并滚动页面
 * @param {String} url 要爬取的页面地址
 * @param {Number} second 延迟时间
 * @param {Number} top 滚动页面高度
 * @return {Object} 类似 jQuery 对象
 */
async function getPageDelay(url, second = 1, top = 1000) {
  delay(second);
  const instance = await phantom.create()
  const page = await instance.createPage()
  const headers = {};
  page.property({
    customHeaders: headers,
    settings: {
      javascriptEnabled: true,
      userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.124 Safari/537.36',
    },
    viewportSize: {
      width: 1024,
      height: 768
    },
  })
  // await page.on('onResourceRequested', function(requestData) {
  //   // console.info('Requesting', requestData.url);
  // });
  
  const status = await page.open(url);
  await page.property('scrollPosition', {
    left: 0,
    top: top
  })
  await delay(second);
  const content = await page.property('content');
  await instance.exit();
  return cheerio.load(content);
}

module.exports = {
  getPage,
  getPageDelay
}

