// 在日常开发环境中，为了方便调试我们往往会加入许多console打印。但是我们不希望在生产环境中存在打印的值。那么这里我们自己实现一个loader去除代码中的console
/**
 * @babel/parser 将源代码解析成 AST
    @babel/traverse 对AST节点进行递归遍历，生成一个便于操作、转换的path对象
    @babel/generator 将AST解码生成js代码
    @babel/types通过该模块对具体的AST节点进行进行增、删、改、查
 */
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const types = require("@babel/types");

function delConsole(source) {
  // 这段代码的作用是将源代码解析为抽象语法树。
  const ast = parser.parse(source, { sourceType: "module" });
  traverse(ast, {
    CallExpression(path) {
      if (
        types.isMemberExpression(path.node.callee) &&
        types.isIdentifier(path.node.callee.object, { name: "console" })
      ) {
        path.remove();
      }
    },
  });
  const output = generator(ast, {}, source);
  console.log("🚀output:", output.code)
  
  return output.code;
}

module.exports = delConsole;
