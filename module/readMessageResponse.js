async function readMessage(conn, Jid){
    const lastMsgInChat = await getLastMessageInChat(Jid) // lihat pesan terkahir
    // tandai belum dibaca menjadi sudah dibaca
    await conn.chatModify({ markRead: true, lastMessages: [lastMsgInChat] }, Jid)
}

module.exports=readMessage