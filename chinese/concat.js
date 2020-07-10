const path = require('path')
const fs = require('fs')

let chinese = fs.readFileSync(path.join(__dirname, 'chinese.txt'), 'utf-8')
let surname = JSON.parse(fs.readFileSync(path.join(__dirname, 'surname.json')))
let arr = chinese.split(' *^* ')
let chineseData = []

for (let i = 0, len = arr.length; i < len; i++) {
  let item = arr[i], x = 0
  if (item !== '') {
    item = JSON.parse(item)
    if (surname.indexOf(item.c) !== -1) {
      x = 1
      surname.splice(surname.indexOf(item.c), 1)
    }
    chineseData.push({
      c: item.c,
      p: item.p,
      s: item.s,
      x: x
    })
  }
}

// console.log(surname)

fs.writeFileSync(path.join(__dirname, 'chinese.json'), JSON.stringify(chineseData), 'utf-8')
