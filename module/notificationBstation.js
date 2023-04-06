const axios = require('axios')
const cheerio = require('cheerio')
const uri = 'https://www.bilibili.tv/id/timeline'

async function bstationUpdate(){
    const res = await axios({
        method: 'get',
        url: uri
    })

    let html = res.data
    let $ = cheerio.load(html)
    let update = $("div[class='timeline timeline--today'] > ul.timeline__content > div[class='timeline-card timeline-card--updated timeline-card--today']")
    // let update = $("div[class='timeline timeline--today'] > ul.timeline__content > div[class='timeline-card timeline-card--today']")
    
    let dataUpdate = []
    update.map(function () {
        let getAnime = $(this).find("div.timeline-card__card")
        let time = $(this).find("p.timeline-card__time").text()

        let dataAnime = []
        getAnime.map(function () {
            let title = $(this).find("div[class='bstar-video-card bstar-video-card--column bstar-video-card--ogv'] > div.bstar-video-card__text-wrap > div[class='bstar-video-card__text bstar-video-card__text--column'] > p[class='bstar-video-card__title bstar-video-card__title--small bstar-video-card__title--bold'] > a.bstar-video-card__title-text").text()
            let baru = $(this).find("div[class='bstar-video-card bstar-video-card--column bstar-video-card--ogv'] > div.bstar-video-card__text-wrap > div[class='bstar-video-card__text bstar-video-card__text--column'] > p[class='bstar-video-card__desc bstar-video-card__desc--small bstar-video-card__desc--highlight']").text()
            let image = $(this).find("div[class='bstar-video-card bstar-video-card--column bstar-video-card--ogv'] > div.bstar-video-card__cover-wrap > div[class='bstar-video-card__cover bstar-video-card__cover--normal'] > a > picture[class='bstar-image bstar-video-card__cover-img'] > img.bstar-image__img").attr('src')

            dataAnime.push({
                title,
                baru,
                image,
                update: baru.includes('Diperbarui')
            })
        })
        
        dataUpdate[time]=dataAnime
    })

    return dataUpdate
}

module.exports = { 
    bstationUpdate
}