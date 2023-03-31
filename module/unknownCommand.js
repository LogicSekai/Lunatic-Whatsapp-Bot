const fs = require('fs')

async function unknownCommand(conn, msg){
    await conn.sendMessage(
        msg.key.remoteJid,
        {
            sticker: fs.readFileSync('./pict/qeqing.webp'),
        },
    )
    await conn.sendMessage(msg.key.remoteJid, { text: 'Maaf saya tidak mengerti!' })
}

module.exports = {
    unknownCommand
}