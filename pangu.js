const fs = require('fs');
const path = require('path');
const dir = 'src/content/products/zh';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const regex1 = /([\u4e00-\u9fa5])([a-zA-Z0-9])/g;
const regex2 = /([a-zA-Z0-9])([\u4e00-\u9fa5])/g;

files.forEach(file => {
  const p = path.join(dir, file);
  const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  function addSpacing(item) {
    if (typeof item === 'string') {
      return item.replace(regex1, '$1 $2').replace(regex2, '$1 $2');
    }
    if (Array.isArray(item)) return item.map(addSpacing);
    if (typeof item === 'object' && item !== null) {
      for (let k in item) item[k] = addSpacing(item[k]);
    }
    return item;
  }
  
  addSpacing(obj);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
});
console.log('Pangu spacing applied');
