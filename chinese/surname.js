/**
 * 爬取百家姓
 * https://xing.911cha.com/
 */
const path = require('path')
const fs = require('fs')
const { getPage, getPageDelay, download } = require('../utils')
const baseUrl = 'https://xing.911cha.com/paiming0.html'
let jsonData = {}

async function spider(url) {
  let $ = await getPage(url)
  let list = $('.zi.pb').find('a')
  for (let i = 0, len = list.length; i < len; i++) {
    let $a = $(list[i])
    $a.find('span').remove()
    let url = $a.attr('href')
    let surname = $a.text()
    console.log(`共【${ len }】条数据，正在爬取第【${ i + 1 }, ${ len - i - 1 }, ${ surname }】条`)
    await spiderOrigin(url, surname)
  }
}

async function spiderOrigin(url, surname) {
  let $ = await getPage('https://xing.911cha.com' + url)
  let dom = $('.mcon.f14').eq(0)
  let img = dom.find('.xpic.pp.mm.fright').attr('src')
  let filename = `姓氏起源_${surname}`
  if (img) {
    jsonData[surname] = {
      t: filename,
      i: img
    }
  }
  dom.find('.xpic.pp.mm.fright').css({ 'display':'flex', 'margin':'auto' })
  dom.find('.zi.mzi').remove()
  dom.find('.pp.mt.bbb.f14').remove()
  dom.find('p').addClass('text')
  dom.find('.l6.rpic.center.f14.pt li').addClass('ulli')
  dom.find('.l6.rpic.center.f14.pt li').find('br').remove()
  let html = dom.html()
  // 顔 没图片，和简体 颜 重复了
  try {
    // download(img, path.join(__dirname, `/img/${surname}.jpg`))
    fs.writeFileSync(path.join(__dirname, `${filename}.html`), html, 'utf-8')
  } catch (err) {
    console.log(err)
  }
}

async function run() {
  await spider(baseUrl)
  // fs.writeFileSync(path.join(__dirname, `a.txt`), JSON.stringify(jsonData), 'utf-8')
}

run()

