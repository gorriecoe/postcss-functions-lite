# Postcss-functions-lite

[PostCSS](https://github.com/postcss/postcss) plugin for exposing JavaScript functions.  This is a lite alternative ready for postcss 8 which doesn't include globbing or have promises built in.

Heavily inspired by [postcss functions by Andy Jansson](https://github.com/andyjansson/postcss-functions).

## Installation

```js
npm install postcss-functions-lite
```

## Usage

```js
const fs = require('fs')
const postcss = require('postcss')
const postcssFunctions = require('postcss-functions-lite')

const options = {
  //options
}

const css = fs.readFileSync('input.css', 'utf8')

postcss()
  .use(postcssFunctions(options))
  .process(css)
  .then(result => {
    const output = result.css
  })
```

Example of a function call:

```css
body {
  prop: foobar()
}
```

## Options

### functions

Type: `Object`

An object containing functions. The function name will correspond with the object key.

**Example:**

```js
const color = require('css-color-converter')
const postcssFunctions = require('postcss-functions-lite')

return postcssFunctions({
  functions: {
    darken: (value, frac) =>  {
      const darken = 1 - parseFloat(frac)
      var rgba = color(value).toRgbaArray()
      var r = rgba[0] * darken
      var g = rgba[1] * darken
      var b = rgba[2] * darken
      return color([r,g,b]).toHexString()
    }
  }
})
```

```css
.foo {
  /* make 10% darker */
  color: darken(blue, 0.1)
}
```
