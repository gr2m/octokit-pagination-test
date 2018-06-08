const items = [
  'foo',
  'bar',
  'baz'
]

async function* getIterator (items) {
  for (let value; value = items.shift();) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    yield value
  }
}

const list = {
  [Symbol.asyncIterator]: () => {
    return getIterator(items)
  }
}

;(async function() {
  for await (const item of list) {
    console.log(`item: ${item}`)
  }
})()
