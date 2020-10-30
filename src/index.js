const valueParser = require('postcss-value-parser')

/**
 * Defines the node value from node type.
 */
const nodeTypes = {
  decl: 'value',
  atrule: 'params',
  rule: 'selector',
  comment: 'text'
}

/**
 * Applys given functions to node.
 *
 * @param {Object} node
 * @param {Object} functions
 */
const transform = (node, functions) => {
  if (node.type === 'function') {
    const args = []

    if ('nodes' in node) {
      const last = node.nodes.map(part => transform(part, functions))
        .reduce((prev, node) => {
          if (node.type === 'div' && node.value === ',') {
            args.push(prev)
            return ''
          }
          return prev + valueParser.stringify(node)
        }, '')

      if (last) {
        args.push(last)
      }
    }

    const func = functions[node.value]
    if (func) {
      node.value = func.apply(func, args)
      delete node.nodes
    }
  }
  return node
}

/**
 * Exposes javaScript functions.
 *
 * @param {Object} opts
 */
module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'postcss-functions',
    Once (root) {
      const functions = opts.functions || {}
      root.walk(node => {
        if (nodeTypes[node.type]) {
          node[nodeTypes[node.type]] = valueParser(
            node[nodeTypes[node.type]]
          ).walk(part => transform(part, functions)).toString()
        }
      })
    }
  }
}

module.exports.postcss = true
