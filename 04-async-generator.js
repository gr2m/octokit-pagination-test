async function* getList (items) {
  for (let value; value = items.shift();) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    yield value
  }
}

;(async function() {
  for await (const item of getList(['foo','bar','baz'])) {
    console.log(`item: ${item}`)
  }
})()
