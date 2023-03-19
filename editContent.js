module.exports = function (content, holdSpace) {

  let attrTextReg = /([a-zA-Z-]+=")([\u4e00-\u9fa5]+)"/gi
  let plainTextReg = /(>\s*)([\u4e00-\u9fa5]+)(\s*<)/gi
  let string = content.replace(attrTextReg, (match, $1, $2) => {
    !holdSpace.includes($2) && holdSpace.push($2)
    return `:${$1}$t('${$2}')"`
  })

  string = string.replace(plainTextReg, (match, $1, $2, $3) => {
    !holdSpace.includes($2) && holdSpace.push($2)
    return `${$1}{{ $t('${$2}') }}${$3}`
  })

  return string
  
  
    // 执行 sed 命令，替换字符串
    // exec(`echo ${str} | sed 's/\\(a\\"\\)\\(b\\)\\(\\"c\\)/:\\1(\\2)\\3/g'`, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`执行 sed 命令失败: ${error}`);
    //     return;
    //   }
    //   // 输出替换后的字符串
    //   console.log(stdout.trim());
    // });
  
  
  
    //   ```
    // sed -E 's/(pattern1)|(pattern2)/\n1: \1\n2: \2/g; H; x; s/\n//'
    // ```
  
    // sed -i 's/regex_a/replacement_a/g; s/regex_c/replacement_c/g' file.txt
}