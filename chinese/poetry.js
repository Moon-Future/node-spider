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

// 爬取古诗
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

// let i = 6;
// spider(dataUrl[i].url, dataUrl[i].filename)


// -------------------------------------------------------------------------------
// 爬取古诗译文
async function spiderA(url) {
  jsonData = []
  let $ = await getPage(url)
  let aList = $('.typecont').find('span a')
  let startTime = new Date()
  // console.log(`正在爬取第【${i + 1}】个【${attr}】，共【${len}】页，正在爬取第【${j}】页`)
  for (let k = 0, len = aList.length; k < len; k++) {
    let href = $(aList[k]).attr('href')
    if (!href) {
      continue
    }
    console.log(`共【${len}】首诗词，正在爬取第【${k + 1}, ${len - k - 1}】首，用时【${(Date.now() - startTime) /
        1000} s】`)
    await getDetailA(href)
  }
}

async function getDetailA(url) {
  let $ = await getPage(bastUrl + url)
  let porteyTitle = $('.cont').eq(1).find('h1').eq(0).text()
  let dynasty = $('.cont').eq(1).find('.source a').eq(0).text()
  let author = $('.cont').eq(1).find('.source a').eq(1).text()
  let content = $('.cont').eq(1).find('.contson').html().replace(/<br>/g, '\n').replace(/<p>/g, '').replace(/<\/p>/g, '').trim()
  if (porteyTitle.indexOf('/') !== -1) {
    porteyTitle = porteyTitle.replace(/\//g, '^')
  }

  let main = $('.main3 .left')
  main.find('.sons').eq(0).css('display', 'none').addClass('except-sons')
  main.find('.sonspic').addClass('sons').nextAll().remove()
  main.find('.title').nextAll().remove()
  main.find('.title').remove()
  main.find('.yizhu').remove()
  main.find('.tag').remove()
  main.find('.tool').remove()
  main.find('.dingpai').remove()
  main.find('a[title="收起"]').remove()
  $('.contyishang').eq(1).find('div').eq(0)

  let aList = main.find('a')
  let ajaxUrl = 'https://so.gushiwen.cn/nocdn/ajax' // fanyi.aspx?id=5D26136B24FE962A
  for (let i = 0; i < aList.length; i++) {
    let item = $(aList[i])
    let href = item.attr('href')
    if (href.indexOf('javascript') !== -1) {
      if (href.indexOf('Play') === -1) {
        // javascript:shangxiShow(787,'BC945BB88FCBC5C9')
        let funcName = href.split(':')[1].split('(')[0].replace('Show', '')
        let num = href.split('(')[1].split(',')[0]
        let str = href.split(',')[1].split(')')[0].replace(/'/g, '')
        let $ajax = await getPage(`${ajaxUrl}${funcName}.aspx?id=${str}`, 'utf-8', { cookie: 'login=flase; login=flase; ASP.NET_SessionId=ljeyfe4h2p1yb2h2vw4wup3i; Hm_lvt_9007fab6814e892d3020a64454da5a55=1594476324,1594827242,1594827815,1594916713' })
        let ajaxHtml = $ajax('body').html()
        if (ajaxHtml === '未登录') {
          console.log(ajaxHtml)
          ajaxHtml = $ajax('body').html()
        }
        main.find(`#${funcName}quan${num}`).css('display', 'block').append(ajaxHtml)
        main.find(`#${funcName}${num}`).remove()
      } else {
        item.remove()
      }
    } 
  }

  main.find('.sonspic').nextAll().remove()
  main.find('.title').nextAll().remove()
  main.find('.title').remove()
  main.find('.yizhu').remove()
  main.find('.tag').remove()
  main.find('.tool').remove()
  main.find('.dingpai').remove()
  main.find('a[title="收起"]').remove()
  main.find('>div:not(.sons)').remove()
  $('.contyishang').eq(1).find('div').eq(0)
  main.find('.cankao').find('div').css({
    width: 'initial',
    float: 'initial'
  })
  main.find('.cankao').find('span').css({
    width: 'initial',
    float: 'initial'
  })

  aList = main.find('a')
  for (let i = 0; i < aList.length; i++) {
    let item = $(aList[i])
    let href = item.attr('href')
    if (href.indexOf('javascript') !== -1 && href.indexOf('Play') !== -1) {
      item.remove()
    } 
  }

  let sons = main.find('.sons')
  for (let i = 0; i < sons.length; i++) {
    let title = sons.eq(i).find('h2').eq(0).find('span').text()
    if (sons.eq(i).hasClass('except-sons')) {
      continue
    }
    if (sons.eq(i).hasClass('sonspic')) {
      title = author
    }
    sons.eq(i).before(`《《《《《-----${title}-----》》》》》`)
  }

  let html = main.html()
  fs.writeFileSync(path.join(__dirname, `./poetry/古诗词_${porteyTitle}.html`), html, 'utf-8')
}

// getDetailA('/shiwenv_f5714bcd33e3.aspx')


let i = 6;
spiderA(dataUrl[i].url)
