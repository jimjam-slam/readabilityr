#!/usr/bin/env node

const http = require("http")
const https = require("https")
const { JSDOM } = require("jsdom")
const { Readability } = require("@mozilla/readability")

// return the html string from a url
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http
    client.get(url, (resp) => {
      let data = ""
      resp.on("data", chunk => data += chunk)
      resp.on("end", () => resolve(data))
    }).on("error", err => reject(err))
  })
}

// parse a remote url using jsdom and readabiltiy
async function parseDocument(url) {
  try {
    const html = await fetchHTML(url)
    const dom = new JSDOM(html)
    const doc = dom.window.document
    // TODO - sanitise input!
    const reader = new Readability(doc)
    const article = reader.parse()
    return article
  } catch (error) {
    console.error("Error fetching or parsing document:", error);
  }
}

// test case: blog post with code chunks and iframes
parseDocument("https://jamesgoldie.dev/writing/themed-slide-sections").then((article) => {
  console.log("Article title:", article.title)
  console.log("Article content:", article.textContent)
})
