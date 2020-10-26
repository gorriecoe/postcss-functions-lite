const test = require('ava')
const postcss = require('postcss')
const postcssFunctions = require('./src')

function testFixture(t, fixture, expected = null, opts = {}) {
  if (expected === null)
    expected = fixture

  return postcss(postcssFunctions(opts)).process(fixture, {
    from: undefined
  }).then(out => {
    t.deepEqual(out.css, expected)
  })
}

test(
  'Should invoke a recognized function',
  testFixture,
  'a{foo:bar()}',
  'a{foo:baz}',
  {
    functions: {
      'bar': () => 'baz'
    }
  }
)

test(
  'Should invoke multiple functions',
  testFixture,
  'a{foo:bar() baz()}',
  'a{foo:bat qux}',
  {
    functions: {
      'bar': () => 'bat',
      'baz': () => 'qux'
    }
  }
)

test(
  'Should ignore unrecognized functions',
  testFixture,
  'a{foo:bar()}'
)

test(
  'Should be able to pass arguments to functions',
  testFixture,
  'a{foo:bar(qux, norf)}',
  'a{foo:qux-norf}',
  {
    functions: {
      'bar': (baz, bat) => baz + '-' + bat
    }
  }
)

test(
  'Should be able to pass arguments with spaces to functions',
  testFixture,
  'a{foo:bar(hello world)}',
  'a{foo:hello-world}',
  {
    functions: {
      'bar': (baz) => baz.replace(' ', '-')
    }
  }
)

test(
  'Should invoke a function in an at-rule',
  testFixture,
  '@foo bar(){bat:qux}',
  '@foo baz{bat:qux}',
  {
    functions: {
      'bar': () => 'baz'
    }
  }
)

test(
  'Should invoke a function in a rule',
  testFixture,
  'foo:nth-child(bar()){}',
  'foo:nth-child(baz){}',
  {
    functions: {
      'bar': () => 'baz'
    }
  }
)

test(
  'Should not pass empty arguments',
  t => {
    return postcss(postcssFunctions({
      functions: {
        'bar': function () {
          t.deepEqual(arguments.length, 0)
        }
      }
    })).process('a{foo:bar()}', {
      from: undefined
    })
  }
)
