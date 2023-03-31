async function welcome(conn, msg){
    await conn.sendMessage(msg.key.remoteJid, { text: 'Welcome to BOT Lunatic' })
}

module.exports={
    welcome
}