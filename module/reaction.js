async function reactToMessage(conn, jid, messageId, reaction) {
    const message = await conn.loadMessage(jid, messageId);
    await conn.chatRead(jid);
    await conn.sendReaction(jid, message.key, reaction);
}

module.exports={
    reactToMessage
}