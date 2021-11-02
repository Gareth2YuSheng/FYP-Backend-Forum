//fix later
let cache = {}
const cacheFn = (req, res, next) => {
  const key = req.url
  if (cache[key]) {
    console.log("Result sent from cache")
    if (cache[key].error=="Connection terminated unexpectedly") {
      res.sendResponse = res.send
      res.send = (body) => {
      cache[key] = JSON.parse(body)
      res.sendResponse(body)
      }
      next()
    } else {
      res.send(cache[key])
    }

  } else {
    res.sendResponse = res.send
    res.send = (body) => {
      cache[key] = JSON.parse(body)
      res.sendResponse(body)
    }
    next()
  }
}