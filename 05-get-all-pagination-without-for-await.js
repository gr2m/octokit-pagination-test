const randomWords = require('random-words')
const words = randomWords(100)
const timeout = 300

function getWordsWithDelay (options) {
  const start = (options.page - 1) * options.perPage
  const end = start + options.perPage
  const ms = Math.random() * timeout + timeout / 2
  return new Promise(resolve => setTimeout(resolve, ms, words.slice(start, end)))
}

function getIteratorFor (result) {
  const state = {
    page: result.page,
    data: result.data
  }
  const perPage = result.perPage
  const numPages = Math.floor(words.length / perPage)

  return {
    async next () {
      const page = state.page++

      if (page > numPages) {
        return { done: true }
      }

      const dataPromise = state.data || getWordsWithDelay({
        page,
        perPage
      })
      delete state.data
      const data = await dataPromise

      return {
        value: {
          page,
          perPage,
          data
        }
      }
    }
  }
}

function getAll (userOptions) {
  const options = Object.assign({page: 1, perPage: 10}, userOptions)
  const dataPromise = getWordsWithDelay(options)
  const resultPromise = dataPromise.then(data => ({
    page: options.page,
    perPage: options.perPage,
    data
  }))

  resultPromise[Symbol.asyncIterator] = () => {
    return getIteratorFor({
      page: options.page,
      perPage: options.perPage,
      data: dataPromise
    })
  }

  return resultPromise
}

async function paginate (resultPromise) {
  const results = []
  const iterator = resultPromise[Symbol.asyncIterator]()
  process.stdout.write('loading')
  do {
    process.stdout.write('.')
    const {value} = await iterator.next()
    if (!value) {
      console.log('')
      return results
    }
    results.push(...value.data)
  } while (true)
}

;(async function () {
  const results = await paginate(getAll())
  console.log(results)
})()
