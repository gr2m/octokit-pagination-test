function getIterator (items) {
  const state = {
    index: 0
  }
  return {
    next () {
      const value = items[state.index++]
      if (value) {
        return { value }
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
  [Symbol.iterator]: () => {
    return getIterator(items)
  }
}

for (const item of list) {
  console.log(item)
}
