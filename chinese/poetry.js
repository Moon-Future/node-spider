/**
 * 爬取古诗词
 * https://so.gushiwen.cn/
 */
const path = require('path')
const fs = require('fs')
const { getPage, getPageDelay } = require('../utils')
let bastUrl = 'https://so.gushiwen.cn'
let jsonData = []
let dataUrl = [
  {
    url: 'https://so.gushiwen.cn/gushi/tangshi.aspx',
    title: '唐诗三百首',
    filename: 'tangshi300.txt'
  },
  {
    url: 'https://so.gushiwen.cn/gushi/sanbai.aspx',
    title: '古诗三百首',
    filename: 'gushi300.txt'
  },
  {
    url: 'https://so.gushiwen.cn/gushi/songsan.aspx',
    title: '宋词三百首',
    filename: 'songci300.txt'
  },
  {
    url: 'https://so.gushiwen.cn/gushi/songci.aspx',
    title: '宋词精选',
    filename: 'songcijx.txt'
  },
  {
    url: 'https://so.gushiwen.cn/gushi/shijiu.aspx',
    title: '古诗十九首',
    filename: 'gushi19.txt'
  },
  {
    url: 'https://so.gushiwen.cn/gushi/shijing.aspx',
    title: '诗经',
    filename: 'shijing.txt'
  },
  {
    url: 'https://so.gushiwen.cn/gushi/chuci.aspx',
    title: '楚辞',
    filename: 'chuci.txt'
  }
]


async function spider(url, filename) {
  jsonData = []
  let $ = await getPage(url)
  let aList = $('.typecont').find('span a')
  let startTime = new Date()
  // console.log(`正在爬取第【${i + 1}】个【${attr}】，共【${len}】页，正在爬取第【${j}】页`)
  for (let k = 0, len = aList.length; k < len; k++) {
    let chinese = $(aList[k]).text()
    let href = $(aList[k]).attr('href')
    if (!href) {
      continue
    }
    console.log(`共【${len}】首诗词，正在爬取第【${k + 1}, ${len - k - 1}】首，用时【${(Date.now() - startTime) /
        1000} s】`)
    await getDetail(href)
  }
  await writeFile(filename)
}

async function getDetail(url) {
  let $ = await getPage(bastUrl + url)
  let title = $('.cont').eq(1).find('h1').eq(0).text()
  let dynasty = $('.cont').eq(1).find('.source a').eq(0).text()
  let author = $('.cont').eq(1).find('.source a').eq(1).text()
  let content = $('.cont').eq(1).find('.contson').html().replace(/<br>/g, '\n').replace(/<p>/g, '').replace(/<\/p>/g, '').trim()
  jsonData.push({
    t: title,
    d: dynasty,
    a: author,
    c: content
  })
}

function writeFile(filename) {
  return new Promise(function() {
    fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(jsonData), { encoding: 'utf8', flag: 'a' })
  })
}

async function run() {
  for (let i = 0, len = dataUrl.length; i < len; i++) {
    await spider(dataUrl[i].url, dataUrl[i].filename)
  }
}

let i = 6;
spider(dataUrl[i].url, dataUrl[i].filename)
