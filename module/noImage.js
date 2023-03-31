const fs = require('fs')

async function noImage(conn, msg){
    await conn.sendMessage(
        msg.key.remoteJid,
        {
            sticker: fs.readFileSync('./pict/kokomi2.webp'),
        },
    )
    await conn.sendMessage(msg.key.remoteJid, { text: 'Harap sertakan gambar!' })
}

module.exports = {
    noImage
}