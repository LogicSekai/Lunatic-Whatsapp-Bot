const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
const { downloadMediaMessage } = require("@adiwajshing/baileys");

async function sendSticker(conn, msg, pack){
    // Unduh file
    const imageBuffer = await downloadMediaMessage(msg, 'buffer', {}, {
        reuploadRequest: conn.updateMediaMessage
    })

    const sticker = new Sticker(imageBuffer, {
        pack: pack, // The pack name
        author: 'Generate by Lunatic Bot - logicsekai.com', // The author name
        type: StickerTypes.FULL, // The sticker type
        categories: ['🤩', '🎉'], // The sticker category
        id: Date.now(), // The sticker id
        quality: 50, // The quality of the output file
        background: {
            "r": 255,
            "g": 255,
            "b": 255,
            "alpha": 0
        }
    })

    conn.sendMessage(msg.key.remoteJid, await sticker.toMessage())
}

module.exports = {
    sendSticker
}