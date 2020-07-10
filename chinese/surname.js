/**
 * 爬取百家姓
 * https://xing.911cha.com/
 */
const path = require('path')
const fs = require('fs')
const { getPage, getPageDelay } = require('../utils')
// let baseUrl = 'https://xing.911cha.com/paiming0.html'
let baseUrl = 'https://www.cnblogs.com/mankii/p/11505962.html'
let jsonData = []

async function spider(url) {
  let $ = await getPage(url)
  let liList = $('.zi.pb').find('li')
  for (let i = 0, len = liList.length; i < len; i++) {
    console.log($(liList[i]).text())
    // await spiderHz(bsHref)
  }
}

spider(baseUrl)
