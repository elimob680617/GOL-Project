const fs = require('fs');
const files = ['IconLinear','IconSolid']
let content = ""

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

files.map((file, index) => {
    fs.readFile('src/components/icon/'+file+'.json', (err, data) => {
        if(err)
            throw new Error('Error Generate Name Icon: '+err)
        const names = JSON.parse(data).icons.map((_, idx)=>`${idx !== 0 ? '\n\t' : ''}"${_.properties.name}"`)
        content = content + `
const ${camelize(file)}Names = [
    ${names}
] as const;
        `
        if(index === files.length - 1) {
            content += `\n
export type SolidIconType = typeof ${camelize(files[0])}Names[number];
export type LinearIconType = typeof ${camelize(files[1])}Names[number];\n`
            fs.writeFile('src/components/icon/IconNames.ts', content, (err) => {
                if (err) {
                  throw new Error(err.message);
                }
              })
        }
    })
})