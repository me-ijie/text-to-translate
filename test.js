let string = '<statistics ref="statistics" @conditionSearch="conditionSearch" placeholder="测试">\r\n测试普通文本   \r\n</statistics>'
let attrTextReg = /([a-zA-Z-]+=")([\u4e00-\u9fa5]+)"/gi
let plainTextReg = /(>\s*)([\u4e00-\u9fa5]+)(\s*<)/gi
// let textReg = /(>\s*)([\u4e00-\u9fa5]+)(\s*<)/gi
let newString = string.replace(attrTextReg, (match, $1, $2) => {
  console.log('attrTextReg', $2)
  return `:${$1}$t('${$2}')"`
})




newString = newString.replace(plainTextReg, (match, $1, $2, $3) => {
  console.log('plainTextReg', $2)
  return `${$1}{{ $t('${$2}') }}${$3}`
})

console.log('newString', newString)