/**
 * 爬取汉字五行
 * http://xh.5156edu.com/
 */
const path = require('path')
const fs = require('fs')
const { getPage, getPageDelay } = require('../utils')

let jin = 'http://xh.5156edu.com/wx/jin',
  jinPage = 6
let mu = 'http://xh.5156edu.com/wx/mu',
  muPage = 7
let shui = 'http://xh.5156edu.com/wx/shu',
  shuiPage = 6
let huo = 'http://xh.5156edu.com/wx/huo',
  huoPage = 5
let tu = 'http://xh.5156edu.com/wx/tu',
  tuPage = 3
let arr = [
  { url: jin, len: jinPage, attr: '金' },
  { url: mu, len: muPage, attr: '木' },
  { url: shui, len: shuiPage, attr: '水' },
  { url: huo, len: huoPage, attr: '火' },
  { url: tu, len: tuPage, attr: '土' },
]

let jsonData = {}

async function spider() {
  for (let i = 0; i < arr.length; i++) {
    let url = arr[i].url,
      len = arr[i].len,
      attr = arr[i].attr
    jsonData[attr] = []
    for (let j = 1; j <= len; j++) {
      let $ = await getPage(j === 1 ? `${url}.html` : `${url}_${j}.html`, 'gbk')
      let aList = $('.fontbox2')
      console.log(`正在爬取第【${i + 1}】个【${attr}】，共【${len}】页，正在爬取第【${j}】页`)
      for (let k = 0; k < aList.length; k++) {
        let chinese = $(aList[k]).text().replace(/[^\u4e00-\u9fa5]/g, '')
        jsonData[attr].push(chinese)
      }
    }
  }
  writeFile()
}

function writeFile() {
  return new Promise(function() {
    fs.writeFileSync(path.join(__dirname, 'attr.json'), JSON.stringify(jsonData), { encoding: 'utf8', flag: 'a' })
  })
}

return
spider()
