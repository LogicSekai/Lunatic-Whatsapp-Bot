const axios = require('axios')
const cheerio = require('cheerio')
const uri = 'https://komikcast.site/'

async function komikcastUpdate(){
    const res = await axios({
        method: 'get',
        url: uri
    })

    let html = res.data
    let $ = cheerio.load(html)
    let title = $("div.postbody > div.bixbox:nth-child(2) > div.listupd > div.utao:nth-child(1) > div.uta > .luf > a > h3").text()
    let img = $("div.postbody > div.bixbox:nth-child(2) > div.listupd > div.utao:nth-child(1) > div.uta > div[class='imgu data-tooltip'] > a > img").attr('src')
    let type = $("div.postbody > div.bixbox:nth-child(2) > div.listupd > div.utao:nth-child(1) > div.uta > .luf > ul").attr('class')
    let chapter = $("div.postbody > div.bixbox:nth-child(2) > div.listupd > div.utao:nth-child(1) > div.uta > .luf > ul > li:nth-child(1) > a").text()

    let array = {
        title,
        type,
        chapter,
        img
    }

    return array
}

module.exports = { 
    komikcastUpdate
}