const axios = require('axios');
const FormData = require('form-data');
const request = require('request');

const { downloadMediaMessage } = require("@adiwajshing/baileys");

const { writeFile } = require ('fs/promises')

async function searchAnime(conn, msg){
    // Unduh file
    const buffer = await downloadMediaMessage(
        msg,
        'buffer',
    { },
    {reuploadRequest: conn.updateMediaMessage})
        
    // Fungsi untuk mencari judul anime
    var data = new FormData();
    data.append('type', msg.message.imageMessage.mimetype.substr(6));
    data.append('data', buffer.toString('base64'));
        
    var config = {
        method: 'post',
        url: process.env.LUNATIC_SERVER + 'api/whatsapp',
        headers: {...data.getHeaders()},
        data : data
    };

    // Menguggah file ke backend logicsekai
    axios(config).then((response) => {
        // Melakukan analisa gambar dan melakukan pencarian terbalik 
        request(process.env.LUNATIC_REVERSE + 'anilistInfo&url=' + response.data.url_img, { json: true }, async (err, res, body) => {
            if (err) { return console.log(err); }
            if(!body.error){
                var similarity = body.result[0].similarity * 100;
                // Mengambil informasi detail anime dari myanimelist
                axios.get(process.env.MAL_API + body.result[0].anilist.idMal).then(async result => {
                    await conn.sendMessage(msg.key.remoteJid, {
                        // Mengirim respon pesan ke whatsapp
                        image: {url: result.data.data.images.jpg.image_url},
                        caption: '_Hasil pencarian ' + String(similarity).slice(0, 2) + '% mirip dengan_\n\n' + '*Title* : ' + result.data.data.title + '\n *Type* : ' + result.data.data.type + '\n *Episode*: _' + result.data.data.episodes + '_\n *Aired from* : ' + result.data.data.aired.from.substr(0, 10) + '\n *Status* : _'+ result.data.data.status + '_\n *Score* : ' + result.data.data.score + '\n\n lunatic.logicsekai.com',
                        // templateButtons: [{
                        //     index: 1,
                        //     urlButton: {
                        //         displayText: 'More details!',
                        //         url: process.env.LUNATIC_SERVER + 'track_resource/details/' + body.result[0].anilist.id + '/' + body.result[0].anilist.idMal + '?pin=' + response.data.url_img
                        //     }
                        // }],
                    })
                }).catch(err => {
                    conn.sendMessage(msg.key.remoteJid, { text: 'Oopsie doopsies 1' })
                });
            } else {
                conn.sendMessage(msg.key.remoteJid, { text: 'Sumber tidak ditemukan: bot ini hanya bekerja dengan gambar tanpa terpotong' })
            }
        });
    }).catch((error) => {
        conn.sendMessage(msg.key.remoteJid, { text: 'Oopsie doopsies 2' })
    });
}

module.exports = {
    searchAnime
}