/**
 * 爬去中文汉字
 * http://xh.5156edu.com/ 在线汉语字典
 */
const path = require('path')
const fs = require('fs')
const { getPage, getPageDelay } = require('../utils')
let len1, num1, len2, num2
let stroke = 0 // 笔划
let jsonData = []

let bsUrl = 'http://xh.5156edu.com/bs.html' // 部首
let hzUrl = 'http://xh.5156edu.com/' // 部首汉字
let infoUrl = 'http://xh.5156edu.com' // 汉字详情

async function spider() {
  let $ = await getPage(bsUrl, 'gbk')
  let bsList = $('.fontbox')
  len1 = bsList.length
  for (let i = 150; i < len1; i++) {
    num1 = i
    let bsItem = $(bsList[i])
    let bsHref = bsItem.attr('href')
    await spiderHz(bsHref)
  }
}

async function spiderHz(url) {
  let $ = await getPage(hzUrl + url, 'gbk')
  let hzList = $('.fontbox')
  let i = 0
  len2 = hzList.length
  if (num1 === 150) {
    i = 106
  }
  for (i; i < len2; i++) {
    num2 = i
    let hzItem = $(hzList[i])
    let hzHref = hzItem.attr('href')
    stroke = hzItem.closest('tr').find('.font_14').text()
    await spiderInfo(hzHref)
  }
}

async function spiderInfo(url) {
  let $ = await getPage(infoUrl + url, 'gbk')
  let chinses = $('.font_22').text()
  let pronunce = $('.font_14').text()
  pronunce = pronunce.replace(/ /g, '').split(',').filter(ele => {
    return ele !== '' && isNaN(Number(ele))
  })
  jsonData = {
    c: chinses,
    p: pronunce,
    s: stroke
  }
  console.log(`共【${len1}】个部首，正在爬去第【${num1}，${len1 - num1}】个，改部首共【${len2}】个汉字，正在爬去第【${num2}，${len2 - num2}】个【${chinses}】`)
  writeFile()
}

function writeFile() {
  return new Promise(function() {
    fs.writeFileSync(path.join(__dirname, 'chinese.txt'), JSON.stringify(jsonData) + ' *^* ', { encoding: 'utf8', flag: 'a' })
  })
}

return
spider()
