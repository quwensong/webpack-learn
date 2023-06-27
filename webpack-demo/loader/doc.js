
/**
 * 需要注意的是，该导出函数必须使用function，不能使用箭头函数，因为loader编写过程中会经常使用到this访问选项和其他方法。
 * @param {*} source 输入的内容
 * @param {*} sourceMap 
 * @param {*} meta 
 * @returns 
 */
function document(source, sourceMap, meta) {

const n = `
/** 
 * 作者：XXX
*/
${source}
`


return n

}

module.exports = document;
