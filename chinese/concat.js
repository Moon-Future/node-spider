const path = require('path')
const fs = require('fs')

// 合并 chinese.txt 和 surname.json（姓氏）
// let chinese = fs.readFileSync(path.join(__dirname, 'chinese.txt'), 'utf-8')
// let surname = JSON.parse(fs.readFileSync(path.join(__dirname, 'surname.json')))
// let arr = chinese.split(' *^* ')
// let chineseData = []

// for (let i = 0, len = arr.length; i < len; i++) {
//   let item = arr[i], x = 0
//   if (item !== '') {
//     item = JSON.parse(item)
//     if (surname.indexOf(item.c) !== -1) {
//       x = 1
//       surname.splice(surname.indexOf(item.c), 1)
//     }
//     chineseData.push({
//       c: item.c,
//       p: item.p,
//       s: item.s,
//       x: x
//     })
//   }
// }
// fs.writeFileSync(path.join(__dirname, 'chinese.json'), JSON.stringify(chineseData), 'utf-8')

// 合并 chinese.json 和 attrData.js（五行）
// let chineseData = JSON.parse(fs.readFileSync(path.join(__dirname, 'chinese.json'), 'utf-8'))
// let { attrData } = require('./attrData.js')
// let obj = {}

// for (let key in attrData) {
//   attrData[key].forEach(ele => {
//     obj[ele] = key
//   })
// }

// chineseData.forEach((ele, index) => {
//   if (obj[ele.c]) {
//     chineseData[index].attr = obj[ele.c]
//     delete obj[ele.c]
//   }
// })

// console.log(obj)

// fs.writeFileSync(path.join(__dirname, 'chinese_attr.json'), JSON.stringify(chineseData), 'utf-8')
