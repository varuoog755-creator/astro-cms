const fs = require('fs');

const code = fs.readFileSync('scratch/old_products.ts', 'utf8');
const start = code.indexOf('export const PRODUCTS_CATALOG: Product[] = [');
const end = code.indexOf('export async function getStorefrontProducts()');
const ts = code.slice(start, end).replace('export const PRODUCTS_CATALOG: Product[] =', 'module.exports =').replace(/},,/g, '},');

fs.writeFileSync('scratch/batch1_eval.cjs', ts, 'utf8');

delete require.cache[require.resolve('./batch1_eval.cjs')];
const items = require('./batch1_eval.cjs').filter(Boolean);

fs.writeFileSync('scratch/batch1.json', JSON.stringify(items, null, 2), 'utf8');
console.log('Successfully saved batch 1 clean products count:', items.length);
