function getIterator (items) {
  const state = {
    index: 0
  }
  return {
    async next () {
      const value = items[state.index++]

      if (value) {
        return new Promise(resolve => setTimeout(resolve, 1000, { value }))
      }

      return { done: true }
    }
  }
}

const items = [
  'foo',
  'bar',
  'baz'
]

const list = {
  // note the change from Symbol.iterator to Symbol.asyncIterator
  [Symbol.asyncIterator]: () => {
    return getIterator(items)
  }
}

;(async function() {
  for await (const item of list) {
    console.log(`item: ${item}`)
  }
})()
