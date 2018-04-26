const { Router } = require('express')
const request = require('request')
const { Parser } = require('xml2js')

const TEST_URL = 'https://www.wired.com/feed/category/science/latest/rss'

module.exports = function feedRouter() {
  const router = new Router()
  router.get('/', async (req, res) => {
    try {
      const feed = await parseXML(TEST_URL)
      res.send(feed)
    }
    catch (err) {
      console.error(err)
      process.exit()
    }
  })
  return router
}

async function parseXML(url) {
  const stories = []
  const parser = new Parser({
    normalizeTags: true,
    explicitArray: false,
    ignoreAttrs: true
  })
  const xml = await new Promise((resolve, reject) => {
    request(url, (err, res, xml) => {
      if (err) reject(err)
      else resolve(xml)
    })
  })
  const parsed = await new Promise((resolve, reject) => {
    parser.parseString(xml, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
  const channel = {
    title: parsed.rss.channel.title,
    description: parsed.rss.channel.description
  }
  parsed.rss.channel.item.forEach(singleItem => {
    const story = {
      title: singleItem.title,
      summary: singleItem.description,
      link: singleItem.link,
      creator: singleItem.creator,
      pubdate: singleItem.pubdate
    }
    stories.push(story)
  })
  return { channel, stories }
}
